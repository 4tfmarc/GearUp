'use client';

export default function FilterSidebar({ products, onFilterChange, className }) {
  const categories = [...new Set(products?.map(product => product.category) || [])];

  const handleCategoryChange = (category, checked) => {
    onFilterChange('category', { category, checked });
  };

  const handleBrandChange = (brand, checked) => {
    onFilterChange('brand', { brand, checked });
  };

  const handlePriceChange = (value) => {
    onFilterChange('price', { value: parseInt(value) });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${className}`}>
      <h2 className="font-semibold text-lg mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input 
                key={`category-${category}`}
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600"
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
              />
              <span key={`category-text-${category}`} className="ml-2 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="space-y-2">
          <input 
            type="range" 
            min="0" 
            max="1000" 
            className="w-full"
            onChange={(e) => handlePriceChange(e.target.value)}
          />
          <div className="flex justify-between text-sm">
            <span key="price-min">$0</span>
            <span key="price-max">$1000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
