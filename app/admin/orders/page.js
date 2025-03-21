'use client'
import React, { useState, useEffect } from 'react';
import { EyeIcon, XMarkIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get the ID token to check admin claims
        const idToken = await user?.getIdTokenResult();
        if (!idToken?.claims?.admin) {
          router.push('/'); // Redirect non-admins
          return;
        }

        const ordersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: formatDate(data.createdAt)
          };
        });
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.code === 'permission-denied') {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      router.push('/');
    }
  }, [user, router]);

  const generatePDF = async (order) => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPos = margin;

      // Add watermark
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.text('GEARUP', pageWidth/2, pageHeight/2, {
        align: 'center',
        angle: 45,
        renderingMode: 'fill'
      });

      // Reset text color and font for rest of content
      doc.setTextColor(66, 66, 66);

      // Add invoice title and details
      doc.setFontSize(24);
      doc.text('INVOICE', pageWidth - margin, yPos, { align: 'right' });
      
      // Add invoice details
      doc.setFontSize(10);
      yPos += 10;
      doc.text(`Invoice #: ${order.id}`, pageWidth - margin, yPos, { align: 'right' });
      yPos += 5;
      doc.text(`Date: ${formatDate(order.createdAt)}`, pageWidth - margin, yPos, { align: 'right' });
      
      // Add billing details
      yPos += 20;
      doc.setFontSize(12);
      doc.setTextColor(66, 66, 66);
      doc.text('BILL TO:', margin, yPos);
      
      if (order.customer) {
        doc.setFontSize(10);
        yPos += 7;
        doc.text(`${order.customer.firstName} ${order.customer.lastName}`, margin, yPos);
        yPos += 5;
        doc.text(order.customer.email, margin, yPos);
        yPos += 5;
        doc.text(order.customer.phone, margin, yPos);
      }

      // Add shipping details
      if (order.shipping) {
        yPos += 15;
        doc.setFontSize(12);
        doc.text('SHIP TO:', margin, yPos);
        
        doc.setFontSize(10);
        yPos += 7;
        doc.text(order.shipping.address, margin, yPos);
        yPos += 5;
        doc.text(`${order.shipping.city}, ${order.shipping.country} ${order.shipping.postalCode}`, margin, yPos);
        yPos += 5;
        doc.text(`Method: ${order.shipping.method}`, margin, yPos);
      }

      // Add items table
      yPos += 20;
      const headers = ['Item', 'Price', 'Quantity', 'Total'];
      const columnWidths = [90, 30, 25, 35];
      
      // Add table headers with background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
      doc.setTextColor(66, 66, 66);
      
      let xPos = margin;
      headers.forEach((header, i) => {
        doc.text(header, xPos + 2, yPos + 6);
        xPos += columnWidths[i];
      });
      
      // Add table rows
      yPos += 8;
      doc.setTextColor(88, 88, 88);
      order.items?.forEach(item => {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = margin;
        }
        
        xPos = margin;
        const itemName = `${item.name} ${item.size !== 'NONE' ? `(${item.size})` : ''}`;
        doc.text(itemName, xPos + 2, yPos + 5);
        xPos += columnWidths[0];
        doc.text(`$${item.price.toFixed(2)}`, xPos + 2, yPos + 5);
        xPos += columnWidths[1];
        doc.text(item.quantity.toString(), xPos + 2, yPos + 5);
        xPos += columnWidths[2];
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, xPos + 2, yPos + 5);
        yPos += 8;
      });

      // Add totals
      yPos += 10;
      const totalsX = pageWidth - margin - 60;
      doc.text('Subtotal:', totalsX, yPos);
      doc.text(`$${(order.total - (order.shipping?.cost || 0)).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
      
      yPos += 8;
      doc.text('Shipping:', totalsX, yPos);
      doc.text(`$${order.shipping?.cost.toFixed(2) || '0.00'}`, pageWidth - margin, yPos, { align: 'right' });
      
      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(66, 66, 66);
      doc.text('Total:', totalsX, yPos);
      doc.text(`$${order.total?.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });

      // Add footer
      const footerY = pageHeight - margin;
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Thank you for your Confidence!', pageWidth / 2, footerY - 5, { align: 'center' });

      // Save PDF
      doc.save(`GearUp-Invoice-${order.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Details</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => generatePDF(order)}
                  disabled={isGeneratingPDF}
                  className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 disabled:opacity-50"
                  title="Download Invoice"
                >
                  <ArrowDownTrayIcon className="h-6 w-6" />
                </button>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-sm text-gray-900 dark:text-white">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-900 dark:text-white">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Updated At</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(order.updatedAt)}</p>
                </div>
              </div>

              {/* Customer Info */}
              {order.customer && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {`${order.customer.firstName} ${order.customer.lastName}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.customer.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Info */}
              {order.shipping && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Shipping Information</h3>
                  <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.shipping.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.shipping.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Country</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.shipping.country}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Postal Code</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.shipping.postalCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Method</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.shipping.method}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Shipping Cost</p>
                      <p className="text-sm text-gray-900 dark:text-white">${order.shipping.cost.toFixed(2)}</p>
                    </div>
                    {order.shipping.notes && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Notes</p>
                        <p className="text-sm text-gray-900 dark:text-white">{order.shipping.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Items</h3>
                <div className="border rounded-lg divide-y">
                  {order.items?.map((item, index) => (
                    <div key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {item.images && item.images.length > 0 && (
                          <div className="col-span-2">
                            <img 
                              src={item.images[0]} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          ${item.price.toFixed(2)} x {item.quantity} {item.size !== 'NONE' ? `(${item.size})` : ''}
                        </p>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-lg font-medium text-gray-900 dark:text-white">Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${order.total?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>;
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Orders</h1>

        {/* Add search bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by ID..."
              className="block w-full rounded-md border-0 py-2 pl-10 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 dark:bg-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                        Order ID
                      </th>
                      <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">
                        User ID
                      </th>
                      <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white md:table-cell">
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Total
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 sm:table-cell">
                          {order.userId || 'N/A'}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 md:table-cell">
                          {order.date}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          ${order.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5
                            ${order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">View order {order.id}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </>
  );
}
