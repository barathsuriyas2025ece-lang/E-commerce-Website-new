import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Pencil, Tag, Filter } from 'lucide-react';
import { productAPI, fallbackSampleProducts } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

const categoriesList = [
  'All',
  'Electronics & Laptops',
  'Audio & Wearables',
  'Apparel & Footwear',
  'Home & Living',
];

const AdminProducts = () => {
  const [products, setProducts] = useState(fallbackSampleProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercent: 10,
    category: 'Electronics & Laptops',
    brand: 'Generic',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
  });

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getProducts({});
      if (res.data?.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
        setProducts(res.data.products);
      } else {
        setProducts(fallbackSampleProducts);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      setProducts(fallbackSampleProducts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discountPercent: 10,
      category: 'Electronics & Laptops',
      brand: 'Generic',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    });
  };

  const { addNotification } = useNotifications();

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const priceNum = Number(formData.price);
      let origPriceNum = Number(formData.originalPrice);
      const discountNum = Number(formData.discountPercent);

      if (!origPriceNum || origPriceNum <= priceNum) {
        origPriceNum = discountNum > 0 ? Math.round(priceNum / (1 - discountNum / 100)) : priceNum;
      }

      const newProdData = {
        name: formData.name,
        description: formData.description,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: discountNum,
        category: formData.category,
        brand: formData.brand || 'Generic',
        stock: Number(formData.stock),
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
      };
      
      const res = await productAPI.createProduct(newProdData);
      const createdProduct = res?.data?.product || {
        _id: 'prod_' + Date.now(),
        ...newProdData,
      };

      setProducts((prev) => [createdProduct, ...prev]);
      if (addNotification) {
        addNotification({
          title: '✨ New Product Added',
          subtitle: `${formData.name} is now live in store at ₹${priceNum.toLocaleString()}`,
          type: 'info',
        });
      }
      setIsAddModalOpen(false);
      resetFormData();
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product._id);
    const priceVal = product.price || 0;
    const origVal = product.originalPrice || priceVal;
    const discountVal = origVal > priceVal ? Math.round(((origVal - priceVal) / origVal) * 100) : (product.discountPercent || 0);

    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: priceVal,
      originalPrice: origVal,
      discountPercent: discountVal,
      category: product.category || 'Electronics & Laptops',
      brand: product.brand || 'Generic',
      stock: product.stock !== undefined ? product.stock : 10,
      imageUrl: (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const priceNum = Number(formData.price);
      let origPriceNum = Number(formData.originalPrice);
      const discountNum = Number(formData.discountPercent);

      if (!origPriceNum || origPriceNum < priceNum) {
        origPriceNum = discountNum > 0 ? Math.round(priceNum / (1 - discountNum / 100)) : priceNum;
      }

      const updatedData = {
        name: formData.name,
        description: formData.description,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: discountNum,
        category: formData.category,
        brand: formData.brand || 'Generic',
        stock: Number(formData.stock),
        images: [formData.imageUrl],
      };

      await productAPI.updateProduct(editingId, updatedData);

      setProducts((prev) =>
        prev.map((p) => (p._id === editingId ? { ...p, ...updatedData } : p))
      );

      if (addNotification) {
        addNotification({
          title: '🔥 Price & Details Updated',
          subtitle: `${formData.name} price updated to ₹${priceNum.toLocaleString()}`,
          type: 'promo',
        });
      }

      setIsEditModalOpen(false);
      setEditingId(null);
      resetFormData();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
      if (addNotification) {
        addNotification({
          title: '📦 Inventory Updated',
          subtitle: `Product removed from store catalog by admin`,
          type: 'info',
        });
      }
    }
  };

  // Compute category counts
  const categoryCounts = categoriesList.reduce((acc, cat) => {
    if (cat === 'All') {
      acc[cat] = products.length;
    } else {
      acc[cat] = products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
    }
    return acc;
  }, {});

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Product Management</h1>
          <p className="text-xs text-slate-500">Add, edit name & prices, set discounts, or remove store products from catalog</p>
        </div>

        <button onClick={() => { resetFormData(); setIsAddModalOpen(true); }} className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category Wise Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 pr-2">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          Category Filter:
        </span>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-semibold'
            }`}
          >
            <span>{cat}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {categoryCounts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Products Table with Edit, Discount, Price & Category display */}
      <div className="glass-panel rounded-2xl overflow-x-auto text-xs text-slate-800 bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-600 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price & Discount</th>
              <th className="p-4">Inventory Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  No products found in category "{selectedCategory}".
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const price = p.price || 0;
                const origPrice = p.originalPrice || price;
                const discountPct = origPrice > price 
                  ? Math.round(((origPrice - price) / origPrice) * 100) 
                  : (p.discountPercent || 0);

                return (
                  <tr key={p._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{p.brand || 'Generic'}</td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-indigo-100">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">₹{price.toLocaleString()}</span>
                          {origPrice > price && (
                            <span className="text-slate-400 line-through text-[11px]">₹{origPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {discountPct > 0 && (
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                            <Tag className="w-3 h-3 text-emerald-600" />
                            <span>{discountPct}% OFF</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${p.stock < 5 ? 'bg-red-50 text-red-700 border border-red-200' : 'badge-stock'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEditModal(p)} 
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" 
                          title="Edit Name, Price & Discount"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p._id)} 
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-4 text-xs text-slate-800 bg-white border border-slate-200 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Create New Catalog Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-slate-700 font-bold">Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g., Apple iPhone 15 Pro" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold">Brand Name</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g., Apple" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Stock Count</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold">Selling Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="99900" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Original MRP (₹)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="119900" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Discount (%)</label>
                  <input type="number" value={formData.discountPercent} onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })} placeholder="15" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium">
                  {categoriesList.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Image URL (Optional)</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>

              <div>
                <label className="text-slate-700 font-bold">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-xl flex-1 justify-center inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2 px-4 rounded-xl flex-1 justify-center inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-4 text-xs text-slate-800 bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Edit Product & Pricing</h2>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ID: {editingId?.slice(-6)}</span>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="text-slate-700 font-bold">Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold">Brand Name</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Stock Count</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold">Selling Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Original MRP (₹)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Discount (%)</label>
                  <input type="number" value={formData.discountPercent} onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium">
                  {categoriesList.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>

              <div>
                <label className="text-slate-700 font-bold">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-xl flex-1 justify-center inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2 px-4 rounded-xl flex-1 justify-center inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
