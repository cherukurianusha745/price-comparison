
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/productsData';

const ICON_OPTIONS = ['monitor', 'smartphone', 'audio', 'camera'];
const STORES = ['Amazon', 'Best Buy', 'Walmart', 'B&H Photo', 'Apple Store'];
const STATUSES = ['In Stock', 'Low Stock', 'Out of Stock'];

const defaultForm = {
  name: '',
  category: 'Electronics',
  currentPrice: '',
  originalPrice: '',
  store: 'Amazon',
  status: 'In Stock',
  icon: 'monitor',
};

const AddProductModal = ({ onAdd, onClose }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.currentPrice || isNaN(form.currentPrice))
      errs.currentPrice = 'Valid price required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onAdd({
      ...form,
      currentPrice: parseFloat(form.currentPrice),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      discount: form.originalPrice
        ? Math.round(
            ((parseFloat(form.originalPrice) - parseFloat(form.currentPrice)) /
              parseFloat(form.originalPrice)) *
              100
          )
        : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-500">Track a new product's price</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sony WH-1000XM5"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-shadow ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category + Icon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Icon Type
              </label>
              <select
                name="icon"
                value={form.icon}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i.charAt(0).toUpperCase() + i.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Current Price ($) *
              </label>
              <input
                name="currentPrice"
                value={form.currentPrice}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                placeholder="299.99"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-shadow ${
                  errors.currentPrice ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.currentPrice && (
                <p className="text-red-500 text-xs mt-1">{errors.currentPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Original Price ($)
              </label>
              <input
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                placeholder="349.99"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Store + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Store
              </label>
              <select
                name="store"
                value={form.store}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                {STORES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Stock Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;