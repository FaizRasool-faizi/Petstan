'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore, useUIStore } from '@/lib/store';
import { Order } from '@/types';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function BuyerOrdersPage() {
  const { user } = useAuthStore();
  const { locale } = useUIStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <FiPackage className="w-5 h-5 text-purple-500" />;
      case 'shipped': return <FiTruck className="w-5 h-5 text-indigo-500" />;
      case 'delivered': return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <FiXCircle className="w-5 h-5 text-red-500" />;
      default: return <FiClock className="w-5 h-5" />;
    }
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-xl font-bold">Please log in as a buyer to view orders.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50" dir={locale === 'ur' ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="container-custom py-12 pt-28 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-8 border-b border-neutral-200 pb-4">
          {locale === 'en' ? 'My Orders' : 'میرے آرڈرز'}
        </h1>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-neutral-200 rounded-xl w-full" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between border-b border-neutral-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-extrabold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-neutral-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="font-bold text-sm bg-neutral-100 px-3 py-1 rounded-full capitalize">
                      {order.status}
                    </span>
                    {getStatusIcon(order.status)}
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                        <Image src={item.petImage} alt={item.petName} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900">{item.petName}</h4>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-extrabold text-primary-600">
                        Rs {item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between text-sm">
                  <div className="space-y-1">
                    <p><span className="text-neutral-500">Seller:</span> {order.sellerName}</p>
                    <p>
                      <span className="text-neutral-500">Payment:</span>{' '}
                      <span className={`capitalize font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </p>
                  </div>
                  <div className="text-right mt-4 sm:mt-0">
                    <p className="text-neutral-500">Total Amount</p>
                    <p className="text-2xl font-extrabold text-neutral-900">
                      Rs {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-neutral-200 rounded-3xl">
            <FiPackage className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg font-bold">
              {locale === 'en' ? 'You have no orders yet.' : 'آپ کا کوئی آرڈر نہیں ہے۔'}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
