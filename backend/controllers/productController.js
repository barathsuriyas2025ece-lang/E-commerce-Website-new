const Product = require('../models/Product');
const { sampleProducts } = require('../utils/seedData');

let memoryProducts = [...sampleProducts];

const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, featured } = req.query;

    try {
      let query = {};
      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
      }
      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }
      if (featured === 'true') {
        query.isFeatured = true;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = {};
      if (sort === 'price-low') sortOptions.price = 1;
      else if (sort === 'price-high') sortOptions.price = -1;
      else if (sort === 'rating') sortOptions.rating = -1;
      else sortOptions.createdAt = -1;

      const products = await Product.find(query).sort(sortOptions);
      if (products && products.length > 0) {
        return res.json({ success: true, count: products.length, products });
      }
    } catch (dbErr) {
      console.log('Using in-memory product catalog.');
    }

    // In-memory filtering logic
    let result = [...memoryProducts];
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw)
      );
    }
    if (category) {
      result = result.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (featured === 'true') {
      result = result.filter((p) => p.isFeatured);
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

    res.json({ success: true, count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);
      if (product) return res.json({ success: true, product });
    } catch (err) {}

    const memoryProd = memoryProducts.find((p) => p._id.toString() === id.toString() || p._id === id);
    if (memoryProd) {
      return res.json({ success: true, product: memoryProd });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images, brand, isFeatured } = req.body;
    const newProd = {
      _id: '6500000000000000000000' + Math.floor(10 + Math.random() * 89),
      name,
      description,
      price: Number(price),
      category,
      brand: brand || 'Generic',
      stock: Number(stock) || 10,
      images: images || ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
      isFeatured: Boolean(isFeatured),
      rating: 4.5,
      numReviews: 1,
      createdAt: new Date(),
    };

    try {
      const created = await Product.create(newProd);
      return res.status(201).json({ success: true, product: created });
    } catch (err) {
      memoryProducts.unshift(newProd);
      return res.status(201).json({ success: true, product: newProd });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, product: updated });
    } catch (err) {}

    const index = memoryProducts.findIndex((p) => p._id.toString() === id.toString());
    if (index !== -1) {
      memoryProducts[index] = { ...memoryProducts[index], ...req.body };
      return res.json({ success: true, product: memoryProducts[index] });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Product.findByIdAndDelete(id);
    } catch (err) {}

    memoryProducts = memoryProducts.filter((p) => p._id.toString() !== id.toString());
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const userId = req.user?._id || req.user?.id || 'u_' + Date.now();
    const userName = req.user?.name || req.user?.email?.split('@')[0] || 'Customer';

    try {
      const product = await Product.findById(productId);
      if (product) {
        if (!product.reviews) product.reviews = [];

        const existingReview = product.reviews.find(
          (r) => r.user.toString() === userId.toString()
        );

        if (existingReview) {
          existingReview.rating = Number(rating);
          existingReview.comment = comment;
        } else {
          product.reviews.push({
            user: userId,
            userName,
            rating: Number(rating),
            comment,
            createdAt: new Date(),
          });
        }

        product.numReviews = product.reviews.length;
        product.rating = Number(
          (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1)
        );

        await product.save();
        return res.status(201).json({ success: true, message: 'Review added successfully', product });
      }
    } catch (dbErr) {}

    const product = memoryProducts.find((p) => p._id.toString() === productId.toString() || p._id === productId);
    if (product) {
      if (!product.reviews) product.reviews = [];

      const existingIndex = product.reviews.findIndex(
        (r) => r.user && r.user.toString() === userId.toString()
      );

      const reviewItem = {
        _id: 'rev_' + Date.now(),
        user: userId,
        userName,
        rating: Number(rating),
        comment,
        createdAt: new Date(),
      };

      if (existingIndex !== -1) {
        product.reviews[existingIndex] = reviewItem;
      } else {
        product.reviews.unshift(reviewItem);
      }

      product.numReviews = product.reviews.length;
      product.rating = Number(
        (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1)
      );

      return res.status(201).json({ success: true, message: 'Review saved successfully', product });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    try {
      const product = await Product.findById(id);
      if (product) {
        product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.length > 0
            ? Number((product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1))
            : 5;
        await product.save();
        return res.json({ success: true, message: 'Review deleted', product });
      }
    } catch (dbErr) {}

    const product = memoryProducts.find((p) => p._id.toString() === id.toString() || p._id === id);
    if (product && product.reviews) {
      product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId && r._id !== reviewId);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.length > 0
          ? Number((product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1))
          : 5;
      return res.json({ success: true, message: 'Review deleted', product });
    }

    res.status(404).json({ success: false, message: 'Product or review not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductReview,
};
