import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { productAPI } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics & Laptops',
    brand: 'Generic',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
  });

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getProducts({});
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await productAPI.createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: [formData.imageUrl],
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'Electronics & Laptops',
          brand: 'Generic',
          stock: 10,
          imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
        });
        fetchProducts();
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Product Management</h1>
          <p className="text-xs text-slate-500">Add, edit, or remove store products from catalog</p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Clean Text-Driven Products Table (No Images) */}
      <div className="glass-panel rounded-2xl overflow-x-auto text-xs text-slate-800 bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-600 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Inventory Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-900 line-clamp-1 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{p.name}</span>
                </td>
                <td className="p-4 font-semibold text-slate-700">{p.brand || 'Generic'}</td>
                <td className="p-4 text-indigo-700 font-bold">{p.category}</td>
                <td className="p-4 font-extrabold text-slate-900">₹{p.price?.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`badge ${p.stock < 5 ? 'bg-red-50 text-red-700 border border-red-200' : 'badge-stock'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 text-slate-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
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
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold">Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Stock Count</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>
              <div>
                <label className="text-slate-700 font-bold">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium">
                  <option>Electronics & Laptops</option>
                  <option>Audio & Wearables</option>
                  <option>Apparel & Footwear</option>
                  <option>Home & Living</option>
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
    </div>
  );
};

export default AdminProducts;
