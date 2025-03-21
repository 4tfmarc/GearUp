'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LockClosedIcon, ShieldCheckIcon, TruckIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

// Your WhatsApp number with country code
const WHATSAPP_NUMBER = '237674066938';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    shippingNotes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/signin?redirect=/checkout');
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleMoveToPayment = async () => {
    setIsLoading(true);
    // Simulate loading to make it feel more like a real payment system
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep(3);
  };

  const handleWhatsAppRedirect = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push('/signin?redirect=/checkout');
        return;
      }

      const idToken = await user.getIdToken(true);
      const now = new Date().toISOString();
      
      // Create complete order object with proper structure
      const orderData = {
        userId: user.uid,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize || 'NO SIZE',
          images: item.images
        })),
        total: cartTotal + (shippingMethod === 'express' ? 15 : 0),
        shipping: {
          method: shippingMethod,
          cost: shippingMethod === 'express' ? 15 : 0,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          notes: formData.shippingNotes || ''
        },
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || user.email,
          phone: formData.phone
        }
      };
      
      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // WhatsApp message formatting
      const message = `Hello! I would like to confirm my order #${order.id}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  const CheckoutSteps = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {['Information', 'Shipping', 'Payment'].map((stepName, idx) => (
          <div key={stepName} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${step > idx + 1 ? 'bg-green-600 border-green-600' : 
                step === idx + 1 ? 'border-blue-600 text-blue-600' : 'border-gray-300'}`}>
              {step > idx + 1 ? (
                <CheckCircleIcon className="w-6 h-6 text-white" />
              ) : (
                <span className="text-sm">{idx + 1}</span>
              )}
            </div>
            <span className={`ml-2 text-sm ${step === idx + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              {stepName}
            </span>
            {idx < 2 && <div className="w-24 h-0.5 mx-4 bg-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  );

  const ShippingMethods = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer bg-blue-50 border-blue-200">
        <div className="flex items-center">
          <input
            type="radio"
            name="shipping"
            value="standard"
            checked={shippingMethod === 'standard'}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <div className="ml-3">
            <span className="block font-medium">Standard Shipping</span>
            <span className="text-sm text-gray-500">4-5 business days</span>
          </div>
        </div>
        <span className="font-medium text-green-600">Free</span>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
        <div className="flex items-center">
          <input
            type="radio"
            name="shipping"
            value="express"
            checked={shippingMethod === 'express'}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="w-4 h-4 text-blue-600"
          />
          <div className="ml-3">
            <span className="block font-medium">Express Shipping</span>
            <span className="text-sm text-gray-500">2-3 business days</span>
          </div>
        </div>
        <span className="font-medium">$15.00</span>
      </div>
    </div>
  );

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 pb-16 px-4 bg-gray-50"> {/* Reduced top padding */}
        <div className="max-w-7xl mx-auto">
          <CheckoutSteps />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-5 text-center md:text-left">Checkout</h1> {/* Smaller heading and margin */}
          
          <div className="flex flex-col lg:flex-row gap-5"> {/* Reduced gap */}
            {/* Main Content - Left Side */}
            <div className="lg:flex-1">
              {step === 1 ? (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">Order Notes (Optional)</label>
                      <textarea
                        name="shippingNotes"
                        rows="3"
                        value={formData.shippingNotes}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Add any special instructions for delivery"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <span>Continue to shipping</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </form>
                </div>
              ) : step === 2 ? (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                  <ShippingMethods />
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800"
                      disabled={isLoading}
                    >
                      Return to information
                    </button>
                    <button
                      onClick={handleMoveToPayment}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Continue to payment'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Maintenance Notice Card - Only shown at payment step */}
                  <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                      <div className="bg-yellow-50 p-2 rounded-full">
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Payment System Maintenance</h2>
                        <p className="text-gray-600 text-sm mt-0.5">Our payment gateway is currently undergoing scheduled maintenance and security upgrades.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-900">
                            Official Payment Support Team
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          For your security and convenience, you'll be connected with our verified payment support team.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span>Verified payment processors</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span>End-to-end transaction support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span>Instant order confirmation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span>Real-time tracking updates</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Order Review</h3>
                      {/* Add order review summary here */}
                    </div>
                    <div className="flex justify-between gap-4 mt-6">
                      <button
                        onClick={() => setStep(2)}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800"
                      >
                        Return to shipping
                      </button>
                      <button
                        onClick={handleWhatsAppRedirect}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
                        </svg>
                        <span>Secure Checkout</span>
                        <CheckBadgeIcon className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Order Summary - Right Side */}
            <div className="lg:w-96">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-24">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Order Summary</h2>
                
                <div className="max-h-96 overflow-y-auto pr-1 space-y-4 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 py-2">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                  <LockClosedIcon className="w-4 h-4 mr-2" />
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
