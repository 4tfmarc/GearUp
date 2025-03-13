'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  StarIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  CheckIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,  // Add these imports
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState('');  // Add this state
  
  // Updated sizes for motorcycle gear
  const sizes = [
    { value: '', label: 'Select size' },
    { value: 'SM', label: 'Small (Fits 5\'6" - 5\'8")' },
    { value: 'MD', label: 'Medium (Fits 5\'8" - 5\'10")' },
    { value: 'LG', label: 'Large (Fits 5\'10" - 6\'0")' },
    { value: 'XL', label: 'X-Large (Fits 6\'0" - 6\'2")' },
    { value: 'XXL', label: '2X-Large (Fits 6\'2" - 6\'4")' },
  ];

  // Add this after the sizes array
  const variants = product?.images?.map((_, idx) => ({
    value: idx,
    label: `Style ${idx + 1}`
  })) || [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${params.id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        
        // Add debug logging
        console.log('Product Category:', data.category);
        console.log('Full Product Data:', data);
        
        // Fetch related products after getting the main product
        if (data.category) {
          console.log('Fetching related products for category:', data.category);
          const relatedResponse = await fetch(`/api/products/related?category=${data.category}&exclude=${params.id}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            console.log('Related Products:', relatedData);
            setRelatedProducts(relatedData);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedVariant) {
      alert('Please select a slide');
      return;
    }
    addToCart({ ...product, selectedSize, selectedVariant }, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedVariant) {
      alert('Please select a slide');
      return;
    }
    addToCart({ ...product, selectedSize, selectedVariant }, quantity);
    router.push('/checkout');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const roundedRating = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      
      if (index < roundedRating) {
        return (
          <StarIcon
            key={index}
            className="h-5 w-5 text-yellow-400 fill-current"
          />
        );
      } else if (index === roundedRating && hasHalfStar) {
        return (
          <div key={index} className="relative">
            <StarIcon className="h-5 w-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        return (
          <StarIcon
            key={index}
            className="h-5 w-5 text-gray-300"
          />
        );
      }
    });
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : (product?.images?.length || 1) - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (product?.images?.length || 1));
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4">
          <div className="text-center text-red-500">
            {error || 'Product not found'}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />     
      <main className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6"> {/* Increased top padding for mobile and desktop */}
        <div className="max-w-6xl mx-auto">
          {/* Back button - helpful for mobile navigation */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-sm text-gray-600 mb-4 hover:text-gray-900"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to products
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Media Gallery */}
            <div className="lg:sticky lg:top-36">
              <div className="flex flex-col sm:flex-row gap-4">  {/* Removed mt-6 sm:mt-8 */}
                {/* Thumbnails with numbering */}
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-20 overflow-x-auto sm:overflow-x-visible">
                  {product?.images?.map((img, idx) => (
                    <div key={idx} className="relative">
                      <button
                        onClick={() => handleImageClick(idx)}
                        className={`relative min-w-[80px] h-20 bg-gray-50 rounded-md overflow-hidden cursor-pointer
                          ${selectedImage === idx ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200'}
                          hover:ring-2 hover:ring-indigo-400 transition-all`}
                      >
                        <Image
                          src={img}
                          alt={`Product view ${idx + 1}`}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white/80 px-1.5 rounded">
                          {idx + 1}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Main Image Container */}
                <div className="flex-1 flex items-center sm:mt-0">  {/* Removed mt-4 */}
                  {/* Left Arrow */}
                  <button 
                    onClick={handlePrevImage}
                    className="flex-shrink-0 -ml-2 sm:-ml-4 bg-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-50 border border-gray-200 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
                  </button>

                  {/* Large Image Display with number indicator */}
                  <div className="flex-1 relative bg-gray-50 rounded-lg overflow-hidden mx-1 sm:mx-2">
                    <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
                      <Image
                        src={product?.images?.[selectedImage] || '/images/placeholder.png'}
                        alt={`${product?.name} - View ${selectedImage + 1}`}
                        width={500}
                        height={500}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                        priority
                      />
                      <span className="absolute bottom-2 right-2 text-sm text-gray-500 bg-white/80 px-2 py-1 rounded">
                        {selectedImage + 1} / {product?.images?.length}
                      </span>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <button 
                    onClick={handleNextImage}
                    className="flex-shrink-0 -mr-2 sm:-mr-4 bg-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-50 border border-gray-200 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="pt-6 sm:pt-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product?.name}</h1>
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center space-x-4">
                  <div className="flex items-center">
                    {renderStars(product?.rating || 0)}
                    <span className="ml-2 text-xs sm:text-sm text-gray-600">
                      {product?.rating?.toFixed(1)} ({product?.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-0">
                    ✓ {product?.soldCount || 0} sold
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mt-4">
                <div className="flex items-baseline flex-wrap gap-2 sm:space-x-3">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">${product?.price}</span>
                  {product?.originalPrice && (
                    <>
                      <span className="text-base sm:text-lg text-gray-500 line-through">${product?.originalPrice}</span>
                      <span className="text-green-600 font-medium text-sm sm:text-base">
                        Save ${(product?.originalPrice - product?.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                {product?.stock > 0 && (
                  <p className="mt-2 text-xs sm:text-sm text-green-600 flex items-center">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    In Stock ({product?.stock} available)
                  </p>
                )}
              </div>

              {/* Size Selection Dropdown */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => window.open('/size-guide', '_blank')}
                  >
                    Size guide
                  </button>
                </div>

                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {sizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>

              </div>

              {/* Style/Variant Selection Dropdown */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Slide</h3>
                </div>

                <select
                  value={selectedVariant}
                  onChange={(e) => {
                    setSelectedVariant(e.target.value);
                    setSelectedImage(Number(e.target.value));
                  }}
                  className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select slide</option>
                  {variants.map((variant) => (
                    <option key={variant.value} value={variant.value}>
                      {variant.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options & Add to Cart */}
              <div className="space-y-4 mt-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border rounded-md w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border-r hover:bg-gray-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 border-l hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 
                      transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    Add to Cart • ${(product?.price * quantity).toFixed(2)}
                  </button>
                </div>
                <button 
                  onClick={handleBuyNow}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-md 
                    hover:border-gray-400 transition-colors font-medium">
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-6 border-t border-b mt-6">
                <div className="text-center">
                  <TruckIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" />
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-600">Free Delivery</p>
                  <p className="text-[10px] sm:text-xs font-medium">Orders over $100</p>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" />
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-600">2-Year Warranty</p>
                  <p className="text-[10px] sm:text-xs font-medium">100% Genuine</p>
                </div>
                <div className="text-center">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400" viewBox="0 0 24 24">
                    {/* Add return icon SVG */}
                  </svg>
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-600">Easy Returns</p>
                  <p className="text-[10px] sm:text-xs font-medium">30-Day Returns</p>
                </div>
              </div>

              {/* Tabs - Scrollable on mobile */}
              <div className="space-y-4 mt-6">
                <div className="border-b overflow-x-auto scrollbar-hide">
                  <nav className="flex whitespace-nowrap space-x-6 sm:space-x-8">
                    {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm inline-block
                          ${activeTab === tab 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="prose prose-sm max-w-none text-sm">
                  {activeTab === 'description' && <p>{product?.description}</p>}
                  {activeTab === 'specifications' && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Add specifications here */}
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div>
                      {/* Add reviews component here */}
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Shipping Policy</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Free standard shipping on orders over $100</li>
                          <li>Standard shipping (5-7 business days): $7.99</li>
                          <li>Express shipping (2-3 business days): $14.99</li>
                          <li>Next-day delivery available for select locations</li>
                          <li>International shipping available to select countries</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-2">Return Policy</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>30-day return window for unused items</li>
                          <li>Free returns on defective items</li>
                          <li>Return shipping fee may apply for non-defective items</li>
                          <li>Items must be in original packaging with tags attached</li>
                          <li>Refunds processed within 5-7 business days</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Did You Know Section */}
              <div className="mt-6 sm:mt-8 bg-blue-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">
                  Did You Know?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Every order is assigned a unique tracking ID that allows you to monitor your purchase from our warehouse 
                      to your doorstep. Our real-time tracking system updates every 2-4 hours, giving you complete visibility 
                      of your order's journey.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-800">
                      We use bank-level SSL encryption and secure payment gateways to protect your data. All transactions are 
                      processed through PCI-compliant systems, and we never store your credit card information. Your security 
                      is our top priority!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-6 sm:pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">You May Also Like</h2>
            <div className="relative">
              <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.id}`}
                    className="flex-none group"
                  >
                    <div className="w-48 sm:w-64 h-48 sm:h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <h3 className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-base sm:text-lg font-medium text-gray-900">${item.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}