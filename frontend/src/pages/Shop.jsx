import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, Star, Check, RotateCcw, PackageX } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const categoriesList = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics & Laptops' },
  { id: 'audio', name: 'Audio & Wearables' },
  { id: 'apparel', name: 'Apparel & Footwear' },
  { id: 'home', name: 'Home & Living' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Always sync URL query parameters cleanly with component state (handling nulls on re-clicks)
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || 'all';
    const t = searchParams.get('tag') || '';
    const sortParam = searchParams.get('sort') || 'newest';

    setSearchQuery(s);
    setSelectedCategory(c);
    setSelectedTag(t);
    setSortBy(sortParam);
  }, [searchParams]);

  let filteredProducts = (products || []).filter((p) => {
    let matchesCategory =
      selectedCategory === 'all' ||
      !selectedCategory ||
      p.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    let matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = (p.price || 0) <= maxPrice;
    let matchesRating = (p.rating || 4.5) >= minRating;
    let matchesStock = !onlyInStock || (p.stock !== undefined ? p.stock : (p.countInStock || 10)) > 0;
    let matchesTag =
      !selectedTag ||
      (selectedTag === 'deals' || selectedTag === 'flash'
        ? (p.originalPrice && p.originalPrice > p.price) || (p.discount && p.discount > 0) || p.onSale || p.tags?.includes('deals') || p.isFeatured
        : p.tags?.includes(selectedTag) || p.category?.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock && matchesTag;
  });

  // Dynamic Sorting
  if (sortBy === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filteredProducts.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
  else if (sortBy === 'bestseller') filteredProducts.sort((a, b) => (b.rating || 4.5) * (b.numReviews || 1) - (a.rating || 4.5) * (a.numReviews || 1));
  else if (sortBy === 'deals') filteredProducts.sort((a, b) => ((b.originalPrice || b.price) - b.price) - ((a.originalPrice || a.price) - a.price));

  // Guaranteed fallback: If strict filtering returns empty for deals/bestsellers, show all items
  if (filteredProducts.length === 0 && (selectedTag === 'deals' || sortBy === 'bestseller') && (products || []).length > 0) {
    filteredProducts = (products || []).slice();
    if (sortBy === 'bestseller') {
      filteredProducts.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }
  }

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('');
    setSearchQuery('');
    setMaxPrice(150000);
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy('newest');
    setSearchParams({});
  };



  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Product Catalog</h1>
        <p className="text-xs sm:text-sm text-slate-500">Filter through thousands of authentic electronics, apparel, and lifestyle gear.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="glass-panel p-6 rounded-3xl h-fit space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">Filter Products</h2>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Category</label>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedTag('');
                    setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat.id ? 'bg-indigo-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Max Price:</span>
              <span className="font-extrabold text-indigo-600">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="150000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Minimum Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Customer Rating</label>
            <div className="space-y-1">
              {[4, 3, 0].map((starVal) => (
                <button
                  key={starVal}
                  onClick={() => setMinRating(starVal)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    minRating === starVal ? 'bg-amber-50 border border-amber-300 text-amber-900 font-extrabold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {starVal > 0 ? `${starVal}★ & above` : 'All Ratings'}
                  </span>
                  {starVal > 0 && <Star className="w-3.5 h-3.5 fill-current text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Catalog Section */}
        <main className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between text-xs text-slate-700 bg-white border border-slate-200 shadow-sm">
            <div>
              Showing <span className="font-extrabold text-slate-900">{filteredProducts.length}</span> products
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="bestseller">🏆 Best Sellers</option>
                <option value="deals">⚡ Today's Deals & Discounts</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Loading Skeletons or Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="glass-panel p-12 text-center text-slate-500 space-y-4 bg-white border border-slate-200 rounded-3xl">
              <PackageX className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-800">No products match your criteria</h3>
                <p className="text-xs text-slate-400">Try broadening your search term or clearing active price & rating filters.</p>
              </div>
              <button
                onClick={handleResetFilters}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 text-xs rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
