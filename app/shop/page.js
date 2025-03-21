'use client';
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ShopPage() {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    maxPrice: 1000,
    searchQuery: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (products) {
      applyFilters();
    }
  }, [products, filters]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Apply brand filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => 
      product.price <= filters.maxPrice
    );

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (type, data) => {
    switch (type) {
      case 'category':
        setFilters(prev => ({
          ...prev,
          categories: data.checked 
            ? [...prev.categories, data.category]
            : prev.categories.filter(cat => cat !== data.category)
        }));
        break;
      case 'brand':
        setFilters(prev => ({
          ...prev,
          brands: data.checked 
            ? [...prev.brands, data.brand]
            : prev.brands.filter(b => b !== data.brand)
        }));
        break;
      case 'price':
        setFilters(prev => ({
          ...prev,
          maxPrice: data.value
        }));
        break;
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearch={handleSearch} className="z-50" />
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Mobile filter button */}
          <div className="flex md:hidden justify-between items-center mb-4">
            <h1 className="text-xl font-bold">All Products</h1>
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile filter sidebar overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden
              ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setShowMobileFilters(false)}
            ></div>
            
            {/* Desktop sidebar container */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar 
                  products={products} 
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
            
            {/* Mobile filter sidebar drawer */}
            <div className={`fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden
              ${showMobileFilters ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-lg">Filters</h2>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar 
                  products={products} 
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="hidden md:flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Products</h1>
                <select className="border rounded-md px-2 py-1">
                  <option>Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>

              {/* Sort on mobile - below filters button */}
              <div className="md:hidden mb-4">
                <select className="border rounded-md px-2 py-2 w-full bg-gray-50">
                  <option>Sort: Latest</option>
                  <option>Sort: Price: Low to High</option>
                  <option>Sort: Price: High to Low</option>
                  <option>Sort: Most Popular</option>
                </select>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              )}
              
              {error && (
                <div className="text-red-500 text-center p-4">
                  Error loading products: {error}
                </div>
              )}
              
              {!loading && !error && (
                <>
                  {/* Result count for mobile */}
                  <div className="md:hidden mb-4 text-sm text-gray-600">
                    Showing {filteredProducts.length > 0 ? filteredProducts.length : products?.length || 0} results
                  </div>
                  <ProductGrid products={filteredProducts.length > 0 ? filteredProducts : products} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
