'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { uploadToImgur } from '@/utils/imgur';
import toast from 'react-hot-toast';

const CATEGORIES = {
  'Helmets & Headgear': [
    'Full Face Helmets',
    'Modular Helmets',
    'Open Face Helmets',
    'Off-Road Helmets',
    'Helmet Accessories'
  ],
  'Riding Gear & Apparel': [
    'Jackets',
    'Pants',
    'Suits',
    'Gloves',
    'Boots',
    'Base Layers'
  ],
  'Motorcycle Parts & Maintenance': [
    'Oil & Fluids',
    'Filters',
    'Brakes',
    'Tires',
    'Engine Parts',
    'Spark Plugs'
  ],
  'Protective Gear & Safety Equipment': [
    'Body Armor',
    'Back Protectors',
    'Knee Guards',
    'Elbow Guards',
    'Reflective Gear'
  ],
  'Electronics & Gadgets': [
    'Cameras',
    'Communication Systems',
    'LED Lights',
    'USB Chargers'
  ],
  'Luggage & Storage': [
    'Saddlebags',
    'Tank Bags',
    'Top Cases',
    'Backpacks',
    'Tail Bags'
  ],
  'Customization & Aesthetic Mods': [
    'Decals',
    'Paint & Graphics',
    'Custom Seats',
    'Windscreens',
    'Mirrors'
  ],
  'Tools & Workshop Equipment': [
    'Hand Tools',
    'Power Tools',
    'Lifts & Stands',
    'Cleaning Supplies',
    'Diagnostic Tools'
  ],
  'Motorcycle Covers & Accessories': [
    'Bike Covers',
    'Lock Systems',
    'Tie Downs',
    'Rain Gear',
    'Grip Accessories'
  ],
  'Adventure & Touring Gear': [
    'Camping Equipment',
    'Navigation Tools',
    'First Aid Kits',
    'Hydration Systems',
    'Emergency Tools'
  ]
};

export default function ProductModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const defaultFormData = {
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    images: [],
    features: [''],
    specifications: [''],
    status: 'Active',
    rating: '0',
    reviewCount: '0',
    soldCount: '0'
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price?.toString() || '',
        stock: initialData.stock?.toString() || ''
      });
      if (initialData.category) {
        setSubcategories(CATEGORIES[initialData.category] || []);
      }
      setImagePreviews(initialData.images || []);
    } else {
      setFormData(defaultFormData);
      setImagePreviews([]);
    }
  }, [initialData]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData({
      ...formData,
      category,
      subcategory: '' // Reset subcategory when category changes
    });
    setSubcategories(CATEGORIES[category] || []);
  };

  // Handle dynamic arrays (features and specifications)
  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageUploading(true);
      try {
        const uploadedUrls = await Promise.all(
          files.map(async (file) => {
            // Convert file to base64
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });

            // Upload to Imgur
            const imageUrl = await uploadToImgur(base64);
            return imageUrl;
          })
        );

        setImagePreviews(prev => [...prev, ...uploadedUrls]);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls]
        }));
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload images');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price || formData.stock === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate price and stock
    if (parseFloat(formData.price) < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    if (parseInt(formData.stock) < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    // Format data for submission
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      images: formData.images.filter(img => img), // Remove any null/undefined values
      features: formData.features.filter(f => f.trim()), // Remove empty features
      specifications: formData.specifications.filter(s => s.trim()) // Remove empty specifications
    };

    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto flex items-start justify-center z-50 pt-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* Category and Stock Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORIES).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
                  <div className="space-y-1 text-center">
                    {imageUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white"></div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group w-24 h-24">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500 px-4 py-2 border border-gray-300">
                            <span>Add Images</span>
                            <input
                              id="image-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleImageUpload}
                              accept="image/*"
                              multiple
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Review Count
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sold Count
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.soldCount}
                  onChange={(e) => setFormData({ ...formData, soldCount: e.target.value })}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {initialData ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  initialData ? 'Update' : 'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
