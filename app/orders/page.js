'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const ordersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Handle different date formats - check if it's a Firestore timestamp or ISO string
          let dateObj;
          if (data.date?.toDate) {
            dateObj = data.date.toDate(); // It's a Firestore timestamp
          } else if (data.createdAt) {
            dateObj = typeof data.createdAt === 'string' ? parseISO(data.createdAt) : data.createdAt;
          } else {
            dateObj = new Date(); // Fallback
          }
          
          return {
            id: doc.id,
            ...data,
            date: dateObj
          };
        });

        // Sort orders by date (most recent first)
        ordersData.sort((a, b) => b.date - a.date);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and track your orders
            </p>
          </div>

          {/* Filter Controls */}
          <div className="mb-6 flex gap-4">
            {['all', 'pending', 'completed', 'cancelled'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  filter === filterOption
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {format(order.date, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flow-root">
                        <ul className="-my-4 divide-y divide-gray-200">
                          {order.items && order.items.map((item, index) => (
                            <li key={index} className="py-4 flex">
                              <div className="relative flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                                {item.images && item.images[0] ? (
                                  <Image
                                    src={item.images[0]}
                                    alt={item.name || 'Product image'}
                                    fill
                                    sizes="64px"
                                    className="object-cover object-center"
                                    priority={index === 0}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <svg 
                                      className="h-8 w-8 text-gray-400" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    ${parseFloat(item.price).toFixed(2)}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Total: ${parseFloat(order.total).toFixed(2)}
                      </p>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}