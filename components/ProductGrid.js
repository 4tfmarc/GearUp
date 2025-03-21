import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';

export default function ProductGrid({ products }) {
  const { addToCart } = useCart();

  if (!products?.length) {
    return <p>No products found.</p>;
  }

  const fallbackImage = '/images/placeholder.png';

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product);
  };

  const handleSaveForLater = (e, productId) => {
    e.preventDefault(); // Prevent navigation
    // TODO: Implement save for later functionality
    console.log('Save for later:', productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link key={product.id} href={`/shop/${product.id}`}>
          <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Image container */}
            <div className="aspect-square w-full overflow-hidden rounded-t-lg relative">
              <Image
                src={product.images?.[0] || fallbackImage}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                width={400}
                height={400}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
              {/* Discount badge if exists */}
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-gray-900">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleSaveForLater(e, product.id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Save for later"
                  >
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium"
                    aria-label="Add to cart"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Stock status */}
              {product.stock <= 5 && product.stock > 0 && (
                <p className="mt-2 text-sm text-orange-600">
                  Only {product.stock} left in stock
                </p>
              )}
              {product.stock === 0 && (
                <p className="mt-2 text-sm text-red-600">Out of stock</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
