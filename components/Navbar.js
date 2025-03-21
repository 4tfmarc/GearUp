'use client'
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from './NavLink';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { UserCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function Navbar({ onSearch, className = '' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const handleSearchInput = (e) => {
    onSearch?.(e.target.value);
  };

  // Check if current path is shop-related
  const isShopActive = pathname.startsWith('/shop') || 
                      pathname.startsWith('/helmets') || 
                      pathname.startsWith('/protection') || 
                      pathname.startsWith('/accessories');

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-40 ${className}`}>
      <div className="bg-red-600 text-white text-center py-2 text-sm">
        Enjoy free shipping in the continental US for orders over $49.99
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-1 h-12 w-32">
            <Link href="/" className="flex items-center h-full">
              <Image
                src="/images/logo.jpg"
                alt="GearUp Moto Logo"
                width={128}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Menu with Search */}
          <div className="hidden sm:flex items-center space-x-6 flex-grow justify-center mx-6">
            {/* Search Bar */}
            <div className="relative w-64">
              <input
                type="search"
                placeholder="Search products..."
                onChange={handleSearchInput}
                className="w-full px-4 py-1.5 text-sm border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <Link 
              href="/shop"
              className="relative text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white group"
            >
              Shop
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white transform origin-left transition-transform duration-300 ${
                isShopActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
            
            <NavLink href="/contact" className="text-sm">Contact</NavLink>
            <NavLink href="/about" className="text-sm">About</NavLink>
          </div>

          {/* Auth, Cart and Mobile Menu Icons */}
          <div className="flex items-center space-x-3">
            {/* Auth Buttons - Desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              {!user ? (
                <>
                  <Link
                    href="/signin"
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm px-4 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <UserCircleIcon className="h-8 w-8" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-xl">
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        {user.email}
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <ShoppingBagIcon className="h-6 w-6 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Search bar in mobile menu */}
              <div className="px-3 py-2">
                <input
                  type="search"
                  placeholder="Search products..."
                  onChange={handleSearchInput}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              {/* Navigation links */}
              <Link
                href="/shop"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* User authentication section for mobile */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {user ? (
                  <>
                    {/* Show user info and options when logged in */}
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {user.email}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    {/* Show sign in/sign up buttons when not logged in */}
                    <Link
                      href="/signin"
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block mx-3 mt-2 mb-2 py-2 text-center text-base font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Cart link in mobile menu footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center">
              <Link 
                href="/cart" 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBagIcon className="h-6 w-6 mr-2" />
                <span className="text-base font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
