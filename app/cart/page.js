'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      // Store the checkout page as the redirect destination
      router.push('/signin?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Discover our latest gear and protection equipment.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold dark:text-white">Shopping Cart</h1>
            <Link 
              href="/shop"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm flex items-center gap-2"
            >
              <span>Continue Shopping</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart items */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      <Image
                        src={item.images?.[0] || '/images/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <Link href={`/shop/${item.id}`} className="block">
                            <h3 className="font-medium text-base mb-1 truncate dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                            ${item.price.toFixed(2)}
                          </p>
                          {item.estimatedDelivery && (
                            <p className="text-green-600 dark:text-green-400 text-xs">
                              Estimated delivery: {item.estimatedDelivery}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.originalPrice && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart summary */}
            <div className="lg:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  {cartTotal >= 100 && (
                    <div className="text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                      Free shipping applied to your order!
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between font-semibold text-lg dark:text-white">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Including taxes</p>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-4 rounded-full hover:bg-gray-800 transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </button>

                {!user && (
                  <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    Please sign in to complete your purchase
                  </p>
                )}
                
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
