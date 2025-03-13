'use client'
import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useProducts } from '@/hooks/useProducts';
import ProductModal from '@/components/admin/ProductModal';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      // Make sure the images array is properly passed
      const formattedData = {
        ...productData,
        images: Array.isArray(productData.images) ? productData.images : [productData.images].filter(Boolean),
        rating: parseFloat(productData.rating) || 0,
        reviewCount: parseInt(productData.reviewCount, 10) || 0,
        soldCount: parseInt(productData.soldCount, 10) || 0
      };
      await createProduct(formattedData);
      toast.success('Product created successfully');
      setModalOpen(false);
    } catch (err) {
      console.error('Create product error:', err);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      // Make sure the images array is properly passed
      const formattedData = {
        ...productData,
        id: selectedProduct.id, // Ensure ID is included
        images: Array.isArray(productData.images) ? productData.images : [],
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock, 10),
        rating: parseFloat(productData.rating) || 0,
        reviewCount: parseInt(productData.reviewCount, 10) || 0,
        soldCount: parseInt(productData.soldCount, 10) || 0
      };
      
      await updateProduct(selectedProduct.id, formattedData);
      toast.success('Product updated successfully');
      setModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Update product error:', err);
      toast.error(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Grid/List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-6 bg-gray-50 dark:bg-gray-700">
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</div>
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</div>
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</div>
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</div>
          <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</div>
          <div className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</div>
        </div>

        {/* Products List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col md:grid md:grid-cols-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="px-6 py-4 flex items-center">
                <div className="flex items-center space-x-3 w-full">
                  {Array.isArray(product.images) && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <div className="text-xs text-gray-500">
                      ⭐ {product.rating || 0} ({product.reviewCount || 0} reviews) • {product.soldCount || 0} sold
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">${product.price}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 hidden md:block">
                <div className="text-sm text-gray-500 dark:text-gray-300">{product.category}</div>
                <div className="text-xs text-gray-400">{product.subcategory}</div>
              </div>
              
              <div className="px-6 py-4 hidden md:block">
                <div className="text-sm text-gray-900 dark:text-white">${product.price}</div>
              </div>
              
              <div className="px-6 py-4 hidden md:block">
                <div className="text-sm text-gray-900 dark:text-white">{product.stock}</div>
              </div>
              
              <div className="px-6 py-4 flex md:block items-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.status === 'Active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.status}
                </span>
              </div>
              
              <div className="px-6 py-4 flex justify-end items-center">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setModalOpen(true);
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-3"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setModalOpen(false);
            setSelectedProduct(null);
          }
        }}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={selectedProduct}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
