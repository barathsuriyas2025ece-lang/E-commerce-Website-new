const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { sampleProducts } = require('../utils/seedData');

let memoryProducts = [...sampleProducts];

const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, featured } = req.query;

    try {
      let query = {};
      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
          { brand: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }
      if (category && category !== 'all') {
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

    // In-memory fallback filtering logic
    let result = [...memoryProducts];
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.category.toLowerCase().includes(kw) ||
          (p.brand && p.brand.toLowerCase().includes(kw))
      );
    }
    if (category && category !== 'all') {
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
      if (product) {
        // Increment view count for popularity metrics
        product.viewsCount = (product.viewsCount || 0) + 1;
        await product.save();
        return res.json({ success: true, product });
      }
    } catch (err) {}

    const memoryProd = memoryProducts.find((p) => p._id.toString() === id.toString() || p._id === id);
    if (memoryProd) {
      memoryProd.viewsCount = (memoryProd.viewsCount || 0) + 1;
      return res.json({ success: true, product: memoryProd });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎯 Weighted Recommendation Engine (40% Category, 25% Brand, 20% Price, 10% Popularity, 5% Rating)
const getWeightedRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    let targetProduct = null;
    let allProducts = [];

    try {
      targetProduct = await Product.findById(id);
      allProducts = await Product.find({ _id: { $ne: id } });
    } catch (dbErr) {}

    if (!targetProduct) {
      targetProduct = memoryProducts.find((p) => (p._id || p.id).toString() === id.toString());
      allProducts = memoryProducts.filter((p) => (p._id || p.id).toString() !== id.toString());
    }

    if (!targetProduct) {
      return res.status(404).json({ success: false, message: 'Target product not found' });
    }

    // Dynamic configurable weights
    const W_CAT = 0.40;
    const W_BRAND = 0.25;
    const W_PRICE = 0.20;
    const W_POP = 0.10;
    const W_RATE = 0.05;

    const scored = allProducts.map((p) => {
      let score = 0;

      // 1. Category Overlap
      if (p.category && targetProduct.category && p.category.toLowerCase() === targetProduct.category.toLowerCase()) {
        score += W_CAT * 100;
      }

      // 2. Brand Match
      if (p.brand && targetProduct.brand && p.brand.toLowerCase() === targetProduct.brand.toLowerCase()) {
        score += W_BRAND * 100;
      }

      // 3. Price Similarity
      if (p.price && targetProduct.price) {
        const priceDiffRatio = Math.abs(p.price - targetProduct.price) / targetProduct.price;
        const priceSim = Math.max(0, 1 - priceDiffRatio);
        score += W_PRICE * (priceSim * 100);
      }

      // 4. Popularity
      const popScore = Math.min(100, ((p.salesCount || 0) * 5) + ((p.viewsCount || 0) * 1));
      score += W_POP * popScore;

      // 5. Customer Rating
      const rateScore = ((p.rating || 4.5) / 5.0) * 100;
      score += W_RATE * rateScore;

      return { product: p, score: Math.round(score) };
    });

    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 6).map((s) => s.product);

    res.json({ success: true, count: recommendations.length, recommendations });
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
      numReviews: 0,
      reviews: [],
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

    const index = memoryProducts.findIndex((p) => (p._id || p.id || '').toString() === id.toString());
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

    memoryProducts = memoryProducts.filter((p) => (p._id || p.id || '').toString() !== id.toString());
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ⭐ Create Verified Review
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const userId = req.user?._id || req.user?.id || 'u_' + Date.now();
    const userName = req.user?.name || req.user?.email?.split('@')[0] || 'Customer';

    // Verify if customer has purchased this product
    let verifiedPurchase = false;
    try {
      const userOrders = await Order.find({ user: userId });
      verifiedPurchase = userOrders.some((o) =>
        o.orderItems.some((item) => (item.product || '').toString() === productId.toString())
      );
    } catch (err) {}

    try {
      const product = await Product.findById(productId);
      if (product) {
        if (!product.reviews) product.reviews = [];

        const existingReview = product.reviews.find(
          (r) => (r.user || '').toString() === userId.toString()
        );

        if (existingReview) {
          existingReview.rating = Number(rating);
          existingReview.comment = comment;
          existingReview.verifiedPurchase = verifiedPurchase;
        } else {
          product.reviews.push({
            user: userId,
            userName,
            rating: Number(rating),
            comment,
            verifiedPurchase,
            helpfulVotes: 0,
            createdAt: new Date(),
          });
        }

        product.numReviews = product.reviews.length;
        product.rating = Number(
          (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1)
        );

        await product.save();

        // Also save to normalized Review collection
        await Review.create({
          product: productId,
          user: userId,
          userName,
          rating: Number(rating),
          comment,
          verifiedPurchase,
        });

        return res.status(201).json({ success: true, message: 'Review added successfully', product });
      }
    } catch (dbErr) {}

    const product = memoryProducts.find((p) => (p._id || p.id).toString() === productId.toString());
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
        verifiedPurchase: true,
        helpfulVotes: 0,
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

// 👍 Vote Review as Helpful
const voteHelpfulReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = (req.user?._id || req.user?.id || 'u_' + Date.now()).toString();

    try {
      const product = await Product.findById(id);
      if (product && product.reviews) {
        const rev = product.reviews.find((r) => (r._id || '').toString() === reviewId.toString());
        if (rev) {
          rev.helpfulVotes = (rev.helpfulVotes || 0) + 1;
          await product.save();
          return res.json({ success: true, message: 'Vote recorded', helpfulVotes: rev.helpfulVotes });
        }
      }
    } catch (dbErr) {}

    const product = memoryProducts.find((p) => (p._id || p.id).toString() === id.toString());
    if (product && product.reviews) {
      const rev = product.reviews.find((r) => (r._id || '').toString() === reviewId.toString());
      if (rev) {
        rev.helpfulVotes = (rev.helpfulVotes || 0) + 1;
        return res.json({ success: true, message: 'Vote recorded', helpfulVotes: rev.helpfulVotes });
      }
    }

    res.status(404).json({ success: false, message: 'Review not found' });
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
            : 4.5;
        await product.save();
        return res.json({ success: true, message: 'Review deleted', product });
      }
    } catch (dbErr) {}

    const product = memoryProducts.find((p) => (p._id || p.id).toString() === id.toString());
    if (product && product.reviews) {
      product.reviews = product.reviews.filter((r) => (r._id || '').toString() !== reviewId.toString());
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.length > 0
          ? Number((product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1))
          : 4.5;
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
  getWeightedRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  voteHelpfulReview,
  deleteProductReview,
};
