const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

let memoryOrders = [
  {
    _id: 'ord_10231',
    user: 'user_cust_001',
    orderItems: [
      { name: 'Asus ROG Strix Gaming Laptop', quantity: 1, price: 68990, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800' },
    ],
    shippingAddress: { fullName: 'Alex Johnson', address: '101 Tech Boulevard', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001', phone: '+91 9876543210' },
    paymentMethod: 'Credit Card',
    itemsPrice: 68990,
    taxPrice: 1200,
    shippingPrice: 0,
    totalPrice: 70190,
    isPaid: true,
    orderStatus: 'Shipped',
    courierName: 'Express Logistics',
    trackingNumber: 'TRK-98471203',
    estimatedDelivery: 'Tomorrow by 5 PM',
    createdAt: new Date(Date.now() - 86400000),
  },
];

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, discountAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    // Deduct inventory stock for each purchased item & notify admin if low stock
    for (const item of orderItems) {
      if (item.product) {
        try {
          const updatedProd = await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } },
            { new: true }
          );

          if (updatedProd) {
            if (updatedProd.stock <= 0) {
              await Notification.create({
                title: '🔴 Out of Stock Warning',
                message: `Product "${updatedProd.name}" is now OUT OF STOCK! (0 items left)`,
                type: 'stock',
              });
            } else if (updatedProd.stock <= 5) {
              await Notification.create({
                title: '⚠️ Low Stock Alert',
                message: `Product "${updatedProd.name}" is low in stock! Only ${updatedProd.stock} items remaining.`,
                type: 'stock',
              });
            }
          }
        } catch (e) {
          console.error('Error updating stock for product:', item.product, e);
        }
      }
    }

    const newOrder = {
      _id: 'ord_' + Math.floor(10000 + Math.random() * 90000),
      user: req.user ? req.user.id : 'guest_user',
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      itemsPrice,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      discountAmount: discountAmount || 0,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Processing',
      courierName: 'Express FastTrack',
      trackingNumber: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
      estimatedDelivery: '2 Business Days',
      createdAt: new Date(),
    };

    try {
      const created = await Order.create(newOrder);
      return res.status(201).json({ success: true, order: created });
    } catch (err) {
      memoryOrders.unshift(newOrder);
      return res.status(201).json({ success: true, order: newOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    try {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json({ success: true, orders });
    } catch (err) {}

    res.json({ success: true, orders: memoryOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json({ success: true, orders });
    } catch (err) {}

    res.json({ success: true, orders: memoryOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, courierName, trackingNumber } = req.body;

    try {
      const updated = await Order.findByIdAndUpdate(
        id,
        { orderStatus, courierName, trackingNumber },
        { new: true }
      );
      if (updated) return res.json({ success: true, order: updated });
    } catch (err) {}

    const index = memoryOrders.findIndex((o) => o._id.toString() === id.toString());
    if (index !== -1) {
      memoryOrders[index].orderStatus = orderStatus || memoryOrders[index].orderStatus;
      if (courierName) memoryOrders[index].courierName = courierName;
      if (trackingNumber) memoryOrders[index].trackingNumber = trackingNumber;
      return res.json({ success: true, order: memoryOrders[index] });
    }

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🚫 Self-Service Order Cancellation (Restores Product Stock)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const order = await Order.findById(id);
      if (order) {
        if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
          return res.status(400).json({ success: false, message: 'Order cannot be cancelled after shipping' });
        }
        order.orderStatus = 'Cancelled';
        await order.save();

        // Restore inventory stock
        for (const item of order.orderItems) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
          }
        }
        return res.json({ success: true, message: 'Order cancelled successfully and inventory stock restored', order });
      }
    } catch (dbErr) {}

    const order = memoryOrders.find((o) => (o._id || o.id).toString() === id.toString());
    if (order) {
      if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
        return res.status(400).json({ success: false, message: 'Order cannot be cancelled after shipping' });
      }
      order.orderStatus = 'Cancelled';
      return res.json({ success: true, message: 'Order cancelled successfully', order });
    }

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder };
