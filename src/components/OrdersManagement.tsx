'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiDownload,
} from 'react-icons/fi';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

interface OrdersManagementProps {
  orders: Order[];
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export default function OrdersManagement({
  orders,
  onUpdateStatus,
}: OrdersManagementProps) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5" />;
      case 'confirmed':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'processing':
        return <FiPackage className="w-5 h-5" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5" />;
      default:
        return <FiClock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    onUpdateStatus?.(orderId, newStatus);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const statusOptions: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Orders</h2>
          <p className="text-neutral-600 mt-1">
            Manage and track your orders ({filteredOrders.length} total)
          </p>
        </div>
      </motion.div>

      {/* Status Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            All Orders
          </motion.button>
          {statusOptions.map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize flex items-center gap-2 ${
                filterStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {getStatusIcon(status)}
              {status}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="card"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Customer: </span>
                      <span className="font-medium text-neutral-900">
                        {order.buyerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Phone: </span>
                      <span className="font-medium text-neutral-900">
                        {order.buyerPhone}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-200">
                          <Image
                            src={item.petImage}
                            alt={item.petName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">
                            {item.petName}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Qty: {item.quantity} × Rs {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-bold text-neutral-900">
                          Rs {item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                    <span className="text-lg font-semibold text-neutral-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      Rs {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value as OrderStatus)
                    }
                    className="input-field text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="capitalize">
                        {status}
                      </option>
                    ))}
                  </select>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOrder(order)}
                    className="btn-outline text-sm flex items-center justify-center gap-2"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Invoice
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <FiPackage className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-2xl text-neutral-600 mb-2">No orders found</p>
            <p className="text-neutral-500">
              {filterStatus !== 'all'
                ? `No ${filterStatus} orders at the moment`
                : 'Orders will appear here once customers make purchases'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neutral-900">
                  Order Details #{selectedOrder.id}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <FiXCircle className="w-6 h-6 text-neutral-600" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Details */}
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-neutral-600">Name: </span>
                      <span className="font-medium">{selectedOrder.buyerName}</span>
                    </p>
                    <p>
                      <span className="text-neutral-600">Email: </span>
                      <span className="font-medium">{selectedOrder.buyerEmail}</span>
                    </p>
                    <p>
                      <span className="text-neutral-600">Phone: </span>
                      <span className="font-medium">{selectedOrder.buyerPhone}</span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3">
                    Shipping Address
                  </h4>
                  <p className="text-sm text-neutral-700">
                    {selectedOrder.shippingAddress.street},{' '}
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state},{' '}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.petImage}
                            alt={item.petName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.petName}</p>
                          <p className="text-sm text-neutral-600">
                            {item.quantity} × Rs {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-bold">
                          Rs {item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Payment Status:</span>
                    <span
                      className={`font-medium capitalize ${
                        selectedOrder.paymentStatus === 'paid'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">
                      Rs {selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
