import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const categoriesList = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics & Laptops' },
  { id: 'audio', name: 'Audio & Wearables' },
  { id: 'apparel', name: 'Apparel & Footwear' },
  { id: 'home', name: 'Home & Living' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState('newest');

  let filteredProducts = products.filter((p) => {
    let matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    let matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (sortBy === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filteredProducts.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900">Product Catalog</h1>
        <p className="text-sm text-slate-500 mt-1">Browse our complete collection of gadgets, footwear, and accessories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="glass-panel p-6 rounded-2xl h-fit space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Filter className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">Filters & Search</h2>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Category</label>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
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
        </aside>

        {/* Catalog Section */}
        <main className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between text-xs text-slate-700 bg-white border border-slate-200 shadow-sm">
            <div>
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> products
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500 space-y-3 bg-white border border-slate-200">
              <p className="text-base font-semibold text-slate-800">No products found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setMaxPrice(150000);
                }}
                className="btn-secondary py-2 px-4 text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
