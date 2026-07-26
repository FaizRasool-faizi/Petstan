'use client';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiInfo, FiCreditCard, FiTruck, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { useCartStore, useDataStore, useUIStore, useAuthStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Order, OrderItem } from '@/types';

function CartPageContent() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const { addOrder } = useDataStore();
  const { locale } = useUIStore();
  const { user } = useAuthStore();
  const isRtl = locale === 'ur';

  // Checkout Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isOrdered, setIsOrdered] = useState(false);
  const [placedOrderIds, setPlacedOrderIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('success')) {
      setIsOrdered(true);
      clearCart();
      toast.success(locale === 'en' ? 'Payment successful! Order placed.' : 'ادائیگی کامیاب! آرڈر دے دیا گیا۔');
    }
    if (searchParams?.get('canceled')) {
      toast.error(locale === 'en' ? 'Payment was canceled.' : 'ادائیگی منسوخ کر دی گئی۔');
    }
  }, [searchParams]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error(locale === 'en' ? 'Your cart is empty' : 'آپ کی کارٹ خالی ہے');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error(locale === 'en' ? 'Please fill in all required fields' : 'براہ کرم تمام لازمی فیلڈز پُر کریں');
      return;
    }

    // Split cart items by seller to create separate orders per seller
    const itemsBySeller: Record<string, typeof items> = {};
    items.forEach((item) => {
      const sellerId = item.pet.sellerId;
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = [];
      }
      itemsBySeller[sellerId].push(item);
    });

    const newOrderIds: string[] = [];

    setIsSubmitting(true);

    try {
      // Create order for each seller
      const orderPromises = Object.keys(itemsBySeller).map(async (sellerId) => {
        const sellerItems = itemsBySeller[sellerId];

        const payload = {
          items: sellerItems.map((item) => ({
            petId: item.pet.id,
            petName: item.pet.name,
            petImage: item.pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=150&fit=crop',
            quantity: item.quantity,
            price: item.pet.price,
            sellerId,
            sellerName: item.pet.sellerName,
          })),
          shippingAddress: {
            street: address.trim(),
            city: address.trim().split(',')[1]?.trim() || 'Karachi',
            state: 'Sindh',
            zipCode: '00000',
          },
          paymentMethod,
          buyerName: fullName.trim(),
          buyerEmail: email.trim() || 'guest@petstan.pk',
          buyerPhone: phone.trim(),
        };

        const res = await axios.post('/api/orders', payload);
        return res.data;
      });

      const createdOrders = await Promise.all(orderPromises);
      const createdOrderIds = createdOrders.map(o => o.id);

      if (paymentMethod === 'online') {
        const checkoutRes = await axios.post('/api/checkout', { orderIds: createdOrderIds });
        window.location.href = checkoutRes.data.url;
        return; // Don't clear cart yet, wait for success redirect
      } else {
        setPlacedOrderIds(createdOrderIds);
        setIsOrdered(true);
        clearCart();
        toast.success(getTranslation('checkoutSuccess', locale));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="container-custom py-12 pt-28 max-w-5xl">
        <AnimatePresence mode="wait">
          {!isOrdered ? (
            <motion.div
              key="cart-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Listings */}
              <div className="lg:col-span-2 space-y-6">
                <h1 className="text-3xl font-extrabold text-neutral-900 border-b border-neutral-200 pb-3 flex items-center gap-2">
                  🛒 {getTranslation('cartTitle', locale)}
                  <span className="bg-primary-100 text-primary-800 text-sm font-extrabold px-3 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </h1>

                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.pet.id}
                        className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 flex gap-4 items-center justify-between"
                      >
                        {/* Image & Breed */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                            <Image
                              src={item.pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop'}
                              alt={item.pet.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link href={`/pets/${item.pet.id}`} className="font-extrabold text-neutral-900 hover:text-primary-600 leading-snug">
                              {item.pet.name}
                            </Link>
                            <p className="text-xs text-neutral-500 font-semibold mt-0.5">{item.pet.breed}</p>
                            <p className="text-xs text-primary-600 font-bold mt-1">
                              {locale === 'en' ? 'Seller' : 'دکاندار'}: {item.pet.sellerName}
                            </p>
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                          {/* Quantity modifiers */}
                          <div className="flex items-center gap-2 border border-neutral-200 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.pet.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 rounded font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-extrabold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.pet.id, Math.min(item.pet.stock, item.quantity + 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 rounded font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <p className="font-extrabold text-neutral-900">
                              Rs {(item.pet.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-bold">
                              Rs {item.pet.price.toLocaleString()} x {item.quantity}
                            </p>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              removeFromCart(item.pet.id);
                              toast.success(locale === 'en' ? 'Item removed' : 'آئٹم ہٹا دیا گیا');
                            }}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Disclaimer box */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <FiInfo className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <h4 className="font-extrabold text-amber-900 text-sm">
                          {getTranslation('cartDisclaimerTitle', locale)}
                        </h4>
                      </div>
                      <p className="text-amber-800 text-xs leading-relaxed font-semibold">
                        {getTranslation('cartDisclaimerText', locale)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white border border-neutral-200 rounded-3xl space-y-4">
                    <p className="text-neutral-500 text-lg font-bold">
                      {getTranslation('cartEmpty', locale)}
                    </p>
                    <Link href="/pets" className="btn-primary inline-block py-2.5 px-6">
                      {locale === 'en' ? 'Browse Pet Listings' : 'اشتہارات دیکھیں'}
                    </Link>
                  </div>
                )}
              </div>

              {/* Checkout Summary panel */}
              <div className="lg:col-span-1 space-y-6">
                <div className="card border border-neutral-200 shadow-sm space-y-6 sticky top-24">
                  <h3 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-3">
                    {locale === 'en' ? 'Summary' : 'خلاصہ'}
                  </h3>

                  <div className="space-y-4 text-sm font-bold text-neutral-700">
                    <div className="flex justify-between">
                      <span>{locale === 'en' ? 'Subtotal' : 'جزوی کل'}</span>
                      <span className="text-neutral-950">Rs {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-100 pt-3 text-lg font-extrabold text-neutral-900">
                      <span>{locale === 'en' ? 'Total' : 'کل رقم'}</span>
                      <span className="text-primary-600">Rs {getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout inputs form */}
                  {items.length > 0 && (
                    <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-neutral-100">
                      <h4 className="font-extrabold text-neutral-900 text-sm">
                        {getTranslation('checkoutShippingTitle', locale)}
                      </h4>

                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-600">{getTranslation('checkoutFullName', locale)} *</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="input-field py-2 text-sm bg-neutral-50/50"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-600">{getTranslation('checkoutPhone', locale)} *</label>
                        <input
                          type="tel"
                          placeholder="e.g. +92 300 1234567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-field py-2 text-sm bg-neutral-50/50"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-600">{getTranslation('checkoutEmail', locale)}</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field py-2 text-sm bg-neutral-50/50"
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-neutral-600">{getTranslation('checkoutAddress', locale)} *</label>
                        <textarea
                          placeholder={locale === 'en' ? 'Enter complete house/street and city address' : 'مکمل گلی، محلہ اور شہر کا پتہ لکھیں'}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="input-field py-2 text-sm bg-neutral-50/50"
                          required
                        />
                      </div>

                      {/* Payment Method Toggle */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-neutral-600">{getTranslation('checkoutPaymentMethod', locale)}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                              paymentMethod === 'cod'
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                            }`}
                          >
                            <FiTruck className="w-5 h-5 mb-1.5" />
                            <span className="text-xs font-extrabold">{getTranslation('checkoutCod', locale)}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('online')}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                              paymentMethod === 'online'
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                            }`}
                          >
                            <FiCreditCard className="w-5 h-5 mb-1.5" />
                            <span className="text-xs font-extrabold">{locale === 'en' ? 'Online Pay' : 'آن لائن ادائیگی'}</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3.5 text-md font-bold mt-4 shadow-lg shadow-primary-900/10 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Processing...' : getTranslation('checkoutPlaceOrder', locale)}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Success confirmation */
            <motion.div
              key="order-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto card text-center space-y-6 py-12 px-8 border border-neutral-200 shadow-lg"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <FiCheckCircle className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-neutral-900">
                  {locale === 'en' ? 'Order Placed!' : 'آرڈر دے دیا گیا!'}
                </h2>
                <p className="text-neutral-500 font-medium leading-relaxed">
                  {getTranslation('checkoutSuccess', locale)}
                </p>
              </div>

              {/* Order reference IDs */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 font-bold text-sm text-neutral-700 space-y-2">
                <p className="text-xs text-neutral-400 font-semibold">{locale === 'en' ? 'Order References:' : 'آرڈر حوالہ نمبر:'}</p>
                {placedOrderIds.map((id) => (
                  <p key={id} className="font-mono text-primary-700">{id}</p>
                ))}
              </div>

              {/* Disclaimer reminder */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-800 leading-relaxed font-bold">
                ⚠️ {locale === 'en'
                  ? 'Note: Deal directly with the sellers using the contact details. Petstan is not responsible for transactions.'
                  : 'نوٹ: رابطہ نمبر کی مدد سے دکاندار سے براہ راست ڈیل کریں۔ پلیٹ فارم ادائیگی کا ذمہ دار نہیں ہے۔'}
              </div>

              <div className="pt-4 flex gap-3">
                <Link href="/pets" className="flex-1">
                  <button className="w-full btn-outline py-2.5 text-sm font-bold">{locale === 'en' ? 'Keep Shopping' : 'خریداری جاری رکھیں'}</button>
                </Link>
                {user?.role === 'seller' && (
                  <Link href="/seller/dashboard" className="flex-1">
                    <button className="w-full btn-primary py-2.5 text-sm font-bold">{getTranslation('navDashboard', locale)}</button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}


export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CartPageContent />
    </Suspense>
  );
}
