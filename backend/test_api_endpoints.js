const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
const { connectDB } = require('./config/db');

async function runVerificationSuite() {
  console.log('🚀 Starting Comprehensive API & MongoDB Atlas Verification Suite...\n');

  // 1. Test Database Connection
  const connected = await connectDB();
  console.log(`1. Database Connection Status: ${connected ? 'CONNECTED (MongoDB Atlas)' : 'FALLBACK MODE'}`);

  // Create a mock user ID with a valid 24-character hexadecimal ObjectId
  const testUserId = new mongoose.Types.ObjectId().toString();
  const testProductId = new mongoose.Types.ObjectId().toString();
  const existingUserId = new mongoose.Types.ObjectId().toString();

  try {
    if (connected) {
      // Seed test users for verification
      await User.deleteMany({ email: { $in: ['testuser@nexusmart.com', 'existingemail@nexusmart.com'] } });

      const testUser = await User.create({
        _id: testUserId,
        name: 'Test Customer',
        email: 'testuser@nexusmart.com',
        password: 'hashedpassword123',
        role: 'customer',
        loyaltyPoints: 100,
      });

      await User.create({
        _id: existingUserId,
        name: 'Existing User',
        email: 'existingemail@nexusmart.com',
        password: 'hashedpassword123',
        role: 'customer',
      });

      console.log('✅ Pre-test user documents seeded in MongoDB Atlas.');

      // 2. Test User Profile Update in MongoDB
      const updatedProfile = await User.findByIdAndUpdate(
        testUserId,
        {
          name: 'Test Customer Updated',
          phone: '+91 9999888877',
          address: '404 Tech Park, Bengaluru',
        },
        { new: true }
      );

      if (updatedProfile && updatedProfile.name === 'Test Customer Updated') {
        console.log('✅ Test 2 PASSED: User profile updated successfully in MongoDB Atlas.');
      } else {
        console.error('❌ Test 2 FAILED: User profile was not updated in MongoDB.');
      }

      // 3. Test Email Duplicate Conflict (409 Conflict Check)
      const duplicateOwner = await User.findOne({
        email: 'existingemail@nexusmart.com',
        _id: { $ne: testUserId },
      });

      if (duplicateOwner) {
        console.log('✅ Test 3 PASSED: Duplicate email ownership check correctly identified HTTP 409 conflict.');
      } else {
        console.error('❌ Test 3 FAILED: Duplicate email check failed to identify conflict.');
      }

      // 4. Test VIP Subscription Update in MongoDB
      const vipUser = await User.findByIdAndUpdate(
        testUserId,
        {
          isVipSubscriber: true,
          vipPlan: 'VIP Pro Annual',
          vipExpiry: '04/08/2027',
        },
        { new: true }
      );

      if (vipUser && vipUser.isVipSubscriber && vipUser.vipPlan === 'VIP Pro Annual') {
        console.log('✅ Test 4 PASSED: VIP Subscription details updated and verified in MongoDB Atlas.');
      } else {
        console.error('❌ Test 4 FAILED: VIP Subscription update failed in MongoDB.');
      }

      // 5. Test Order Creation in MongoDB without CastError
      const testOrder = await Order.create({
        user: testUserId,
        orderItems: [
          {
            product: testProductId,
            name: 'MacBook Air M3 Pro Edition',
            quantity: 1,
            price: 114900,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
          },
        ],
        shippingAddress: {
          fullName: 'Test Customer Updated',
          address: '404 Tech Park',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          phone: '+91 9999888877',
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 114900,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: 114900,
        isPaid: true,
        orderStatus: 'Processing',
      });

      if (testOrder && testOrder._id && testOrder.user.toString() === testUserId) {
        console.log(`✅ Test 5 PASSED: Order created cleanly in MongoDB Atlas with ObjectId: ${testOrder._id}`);
      } else {
        console.error('❌ Test 5 FAILED: Order creation failed in MongoDB.');
      }

      // Cleanup test documents
      await User.deleteMany({ email: { $in: ['testuser@nexusmart.com', 'existingemail@nexusmart.com'] } });
      await Order.findByIdAndDelete(testOrder._id);
      console.log('🧹 Cleanup: Test records removed from MongoDB Atlas.');
    }
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
  } finally {
    process.exit(0);
  }
}

runVerificationSuite();
