# 🛒 Enterprise AI-Powered E-Commerce Platform (MERN Stack)

A production-ready, ultra-modern E-Commerce platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Features a **Floating AI Shopping Assistant** available on every page that performs website actions (product search, comparison matrix, cart/wishlist management, coupon application, order tracking, voice navigation, and support).

---

## 🔗 Live Deployment URLs & Repository

- **GitHub Repository**: `https://github.com/barathsuriyas2025ece-lang/E-Commerce-website-`
- **Live Backend (Render)**: `https://e-commerce-website-oxb0.onrender.com`
- **Live Frontend (Vercel)**: `https://your-app-name.vercel.app` *(Follow Vercel deployment guide below)*

---

## ✨ Features Highlight

### 🛍️ Customer Portal
- **Storefront & Catalog**: Animated hero banners, category filter grid, natural language & keyword search, price range & rating filters, sorting (Price, Newest, Rating).
- **Product Details & Gallery**: High-res image display, stock availability, star breakdown, reviews & submission form, related recommendations.
- **Cart & Checkout Workflow**: Slide-over drawer, promo code applier, interactive checkout simulation (Card, UPI, NetBanking, COD), invoice receipt.
- **Order Tracking & Portal**: Real-time status update tracking timeline (`Pending` → `Processing` → `Shipped` → `Delivered`).
- **Wishlist & Compare**: Save items, side-by-side product comparison modal with Pros/Cons breakdown.

### 🤖 Action-Oriented Floating AI Shopping Assistant
- **Floating Glass UI**: Persistent floating action button on bottom-right of every page.
- **Website Action Engine**:
  - `SEARCH_PRODUCTS`: Filters catalog based on conversational intent (e.g. *"Show gaming laptops under ₹70,000"*).
  - `COMPARE_PRODUCTS`: Generates side-by-side comparison matrix.
  - `ADD_TO_CART`: Direct cart modification via voice or text.
  - `APPLY_COUPON`: Auto-applies discounts.
  - `TRACK_ORDER`: Fetches order status & courier updates.
  - `REDIRECT_CHECKOUT`: Direct navigation to checkout.
- **Voice Shopping**: Speech-to-Text (STT) mic input with Text-to-Speech (TTS) response playback.
- **Session Memory**: Remembers user budget, category preference, past searches, and preferred brand.

### 👑 Admin Control Center
- **Analytics Dashboard**: Metric cards (Revenue, Total Orders, Low Stock Alerts, Customers), revenue charts, top selling products.
- **Product & Category CRUD**: Image upload, pricing, stock count, category assignment, featured flags.
- **Order Fulfillment Manager**: Real-time status dropdown update, shipping courier tracking ID assignment.
- **Review Moderation & Coupons**: Manage discount codes, moderate user reviews, site banners.

---

## 🛠️ Tech Stack & Architecture

```
d:\e commerce website\
├── backend/            # Express, Node.js, MongoDB (Mongoose + In-Memory Fallback Engine)
│   ├── config/         # Database & environment configuration
│   ├── controllers/    # Auth, Product, Order, Admin, AI, Review, Wishlist, Coupon, Analytics
│   ├── middleware/     # Auth JWT, Admin verification, Rate limiter, Error handler
│   ├── models/         # User, Product, Category, Order, Review, Wishlist, Coupon, AuditLog
│   ├── routes/         # REST API endpoints
│   ├── services/       # AI Engine, Search service, Recommendation engine
│   ├── render.yaml     # Render Web Service deployment configuration
│   └── index.js        # Express server entry point
├── frontend/           # React 18, Vite, Lucide Icons, Glassmorphism CSS Design System
│   ├── public/         # Manifest, Service worker, Assets
│   ├── src/
│   │   ├── components/ # Navbar, Footer, ProductCard, SkeletonLoader
│   │   ├── widgets/    # FloatingAI, AIChatWindow, AIMessage, QuickActionChips
│   │   ├── comparison/ # Product comparison matrix component
│   │   ├── context/    # AuthContext, CartContext, WishlistContext, AIContext, ThemeContext
│   │   ├── hooks/      # useAI, useVoice, useWishlist, useCart, useTheme
│   │   ├── pages/      # Home, Shop, Product, Cart, Checkout, Orders, Wishlist, Profile
│   │   ├── pages/admin/# Dashboard, Products, Orders, Users, Reviews, Analytics
│   │   ├── styles/     # HSL variables, glassmorphism, dark mode tokens
│   │   └── App.jsx
│   └── vercel.json     # Vercel SPA rewrite deployment configuration
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```
*(Note: If no MongoDB Atlas URI is specified in `.env`, the server automatically initializes in **In-Memory Fallback Mode** with sample seed data so you can test immediately!)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Web app runs on http://localhost:5173
```

---

## 🌐 Deployment Instructions

### Deploying Backend to Render
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> New Web Service.
3. Connect your GitHub repository and select the `backend` directory as Root Directory.
4. Build Command: `npm install`
5. Start Command: `node index.js`
6. Add Environment Variables:
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_super_secret_jwt_key`
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`

### Deploying Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) -> Import Project.
2. Select your GitHub repository and set Root Directory to `frontend`.
3. Framework Preset: `Vite`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-api-name.onrender.com/api`
5. Deploy! Vercel handles SPA routing using `vercel.json`.

---

## 📝 License
This project is open-source and available under the MIT License.
