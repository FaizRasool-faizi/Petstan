'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUIStore, useAuthStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiUsers, FiTrendingUp, FiShoppingBag, FiAlertTriangle, FiPlus, FiGrid, FiUserPlus, FiLock, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import axios from 'axios';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'stores' | 'orders' | 'feed' | 'register-admin'>('stores');
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState({ sellersCount: 0, ordersCount: 0, feedCount: 0, totalRevenue: 0 });
  const [sellers, setSellers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Feed Form State
  const [feedName, setFeedName] = useState('');
  const [feedType, setFeedType] = useState('Dog Feed');
  const [feedPrice, setFeedPrice] = useState('');
  const [feedStock, setFeedStock] = useState('');
  const [feedDesc, setFeedDesc] = useState('');
  const [feedImg, setFeedImg] = useState('');

  // Register Admin Form State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, sellersRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/sellers'),
        axios.get('/api/admin/orders')
      ]);
      setStats(statsRes.data);
      
      // Filter out the official petstan store from the sellers list to keep UI clean
      const filteredSellers = sellersRes.data.filter((s: any) => s.storeName !== 'Petstan Official Store');
      setSellers(filteredSellers);
      
      setOrders(ordersRes.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
         toast.error('Unauthorized. Please log in as admin.');
         router.push('/');
      } else {
         toast.error('Failed to load admin data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Direct access check
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access Denied. Admins Only.');
      router.push('/');
    } else {
      fetchData();
    }
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  // System Statistics
  const { totalRevenue, feedCount, sellersCount, ordersCount } = stats;

  const handleWarnSeller = async (id: string) => {
    try {
      await axios.patch(`/api/admin/sellers/${id}`, { action: 'warn' });
      toast.success(getTranslation('adminWarningSent', locale));
      fetchData();
    } catch (error) {
      toast.error('Failed to warn seller');
    }
  };

  const handleToggleSuspension = async (id: string, suspendStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/sellers/${id}`, { action: 'suspend', suspendStatus });
      toast.success(locale === 'en' ? (suspendStatus ? 'Store suspended!' : 'Store unsuspended!') : (suspendStatus ? 'دکان معطل کر دی گئی ہے!' : 'معطلی ختم کر دی گئی!'));
      fetchData();
    } catch (error) {
      toast.error('Failed to update suspension status');
    }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedName.trim() || !feedPrice || !feedStock || !feedDesc.trim()) {
      toast.error(locale === 'en' ? 'All fields are required' : 'تمام فیلڈز پُر کرنا لازمی ہے');
      return;
    }

    try {
      await axios.post('/api/admin/feed', {
        name: feedName,
        breed: feedType,
        price: feedPrice,
        stock: feedStock,
        description: feedDesc,
        images: feedImg ? [feedImg] : []
      });
      
      toast.success(locale === 'en' ? 'Pet Feed listing added successfully!' : 'فیڈ کا اشتہار کامیابی سے شامل ہو گیا!');
      
      setFeedName('');
      setFeedPrice('');
      setFeedStock('');
      setFeedDesc('');
      setFeedImg('');
      fetchData();
    } catch (error) {
      toast.error('Failed to add feed');
    }
  };

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      await axios.post('/api/admin/register', {
        name: adminName,
        email: adminEmail,
        password: adminPassword
      });
      toast.success(`Admin "${adminName}" registered successfully!`);
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to register admin');
    }
  };

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-50 pb-16">
      <Toaster position="top-right" />
      <Navbar />

      <div className="container-custom pt-28">
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-8 tracking-tight flex items-center gap-3">
          🛡️ {getTranslation('adminTitle', locale)}
          {isLoading && <FiLoader className="w-6 h-6 text-primary-500 animate-spin" />}
        </h1>

        {/* System Stats Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-neutral-700">
          <div className="card border border-neutral-200 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{sellersCount}</p>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {locale === 'en' ? 'Total Shops' : 'کل رجسٹرڈ دکانیں'}
              </p>
            </div>
          </div>

          <div className="card border border-neutral-200 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center flex-shrink-0">
              <FiShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{ordersCount}</p>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {locale === 'en' ? 'System Orders' : 'کل سسٹمی آرڈرز'}
              </p>
            </div>
          </div>

          <div className="card border border-neutral-200 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">Rs {totalRevenue.toLocaleString()}</p>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {locale === 'en' ? 'Gross Transaction' : 'سسٹم کی کل آمدنی'}
              </p>
            </div>
          </div>

          <div className="card border border-neutral-200 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <FiGrid className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{feedCount}</p>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {locale === 'en' ? 'Feed Products' : 'خوراک پروڈکٹس'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('stores')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'stores'
                ? 'border-primary-600 text-primary-600 bg-white/50 rounded-t-xl'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            🏢 {locale === 'en' ? 'Shops Directory' : 'دکانوں کا انتظام'}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'orders'
                ? 'border-primary-600 text-primary-600 bg-white/50 rounded-t-xl'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            📋 {locale === 'en' ? 'System Orders' : 'سسٹم آرڈرز'}
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'feed'
                ? 'border-primary-600 text-primary-600 bg-white/50 rounded-t-xl'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            🥫 {locale === 'en' ? 'Add Pet Feed' : 'خوراک شامل کریں'}
          </button>
          <button
            onClick={() => setActiveTab('register-admin')}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'register-admin'
                ? 'border-primary-600 text-primary-600 bg-white/50 rounded-t-xl'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            👤 {locale === 'en' ? 'Register Admin' : 'نیا ایڈمن بنائیں'}
          </button>
        </div>

        {/* Dashboard Tabs Content */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-3xl backdrop-blur-sm">
              <FiLoader className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
          )}
          
          {/* Tab 1: Stores Management */}
          {activeTab === 'stores' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden p-6 space-y-4">
              <h2 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
                🏢 {locale === 'en' ? 'Registered Shops & Fraud Audit' : 'رجسٹرڈ دکانوں کی فہرست'}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-bold text-neutral-700">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left text-neutral-500">
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Shop</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Rating</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Sales</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Warnings</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Status</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((seller) => (
                        <tr key={seller._id} className="border-b border-neutral-150 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-4 flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                              {seller.logo ? (
                                <Image src={seller.logo} alt={seller.storeName} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-neutral-200" />
                              )}
                            </div>
                            <div>
                              <p className="font-extrabold text-neutral-900">
                                {seller.storeName}
                              </p>
                              <p className="text-[10px] text-neutral-400 font-semibold">{seller.contactInfo?.address || 'N/A'}</p>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-secondary-600">
                            ⭐ {seller.rating?.toFixed(1) || 0}
                          </td>

                          <td className="py-4 px-4 text-neutral-900">
                            {seller.totalSales || 0} {locale === 'en' ? 'sales' : 'فروخت'}
                          </td>

                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                              (seller.warningCount || 0) > 0 ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              ⚠️ {seller.warningCount || 0}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              seller.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {seller.isSuspended ? (locale === 'en' ? 'Suspended' : 'معطل ہے') : (locale === 'en' ? 'Active' : 'فعال')}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleWarnSeller(seller._id)}
                                className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100 text-xs font-extrabold transition-all"
                              >
                                {getTranslation('adminWarnBtn', locale)}
                              </button>

                              {seller.isSuspended ? (
                                <button
                                  onClick={() => handleToggleSuspension(seller._id, false)}
                                  className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 text-xs font-extrabold transition-all"
                                >
                                  {getTranslation('adminUnsuspendBtn', locale)}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleSuspension(seller._id, true)}
                                  className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 text-xs font-extrabold transition-all"
                                >
                                  {getTranslation('adminSuspendBtn', locale)}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {sellers.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-neutral-400">
                          {locale === 'en' ? 'No registered shops found.' : 'کوئی دکانیں نہیں ملیں۔'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Orders Audit */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden p-6 space-y-4">
              <h2 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
                📋 {getTranslation('adminOrders', locale)}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-bold text-neutral-700">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left text-neutral-500">
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Order ID</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Date</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Buyer</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Seller Store</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Amount</th>
                      <th className={`py-4 px-4 font-extrabold ${isRtl ? 'text-right' : ''}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id} className="border-b border-neutral-150 hover:bg-neutral-50/50">
                        <td className="py-4 px-4 font-mono text-primary-700 text-xs">{ord._id}</td>
                        <td className="py-4 px-4 font-medium text-xs">
                          {new Date(ord.orderDate || ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-extrabold text-neutral-900">{ord.buyerName}</p>
                            <p className="text-[10px] text-neutral-400 font-semibold">{ord.buyerPhone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600 font-bold">
                          {ord.sellerName}
                        </td>
                        <td className="py-4 px-4 text-primary-600 font-extrabold">
                          Rs {ord.totalAmount?.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                            ord.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-neutral-400">
                           {locale === 'en' ? 'No orders found.' : 'کوئی آرڈرز نہیں ملے۔'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Official Brand Feed Products Creator */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
                  🥫 {getTranslation('adminFeedFormTitle', locale)}
                </h2>
                <form onSubmit={handleAddFeed} className="space-y-4 font-bold text-sm text-neutral-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-600">{locale === 'en' ? 'Feed Product Name' : 'خوراک کا نام'} *</label>
                      <input
                        type="text"
                        placeholder="e.g. Petstan High Fiber Rabbit Feed"
                        value={feedName}
                        onChange={(e) => setFeedName(e.target.value)}
                        className="input-field py-2 text-sm bg-neutral-50/50"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-600">{locale === 'en' ? 'Feed Type / Target' : 'جانور کی قسم'} *</label>
                      <select
                        value={feedType}
                        onChange={(e) => setFeedType(e.target.value)}
                        className="input-field text-sm bg-neutral-50/50"
                      >
                        <option>Dog Feed</option>
                        <option>Cat Feed</option>
                        <option>Bird Feed</option>
                        <option>Fish Feed</option>
                        <option>Rabbit Feed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-600">{locale === 'en' ? 'Price (PKR)' : 'قیمت (روپے)'} *</label>
                      <input
                        type="number"
                        placeholder="e.g. 1500"
                        value={feedPrice}
                        onChange={(e) => setFeedPrice(e.target.value)}
                        className="input-field py-2 text-sm bg-neutral-50/50"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-600">{locale === 'en' ? 'Stock Quantity' : 'سٹاک تعداد'} *</label>
                      <input
                        type="number"
                        placeholder="e.g. 100"
                        value={feedStock}
                        onChange={(e) => setFeedStock(e.target.value)}
                        className="input-field py-2 text-sm bg-neutral-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-600">{locale === 'en' ? 'Product Description' : 'مصنوعات کی تفصیل'} *</label>
                    <textarea
                      placeholder="Write nutritional values, size, flavor..."
                      value={feedDesc}
                      onChange={(e) => setFeedDesc(e.target.value)}
                      rows={4}
                      className="input-field py-2 text-sm bg-neutral-50/50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-600">{locale === 'en' ? 'Product Image URL' : 'امیج کا یو آر ایل'}</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={feedImg}
                      onChange={(e) => setFeedImg(e.target.value)}
                      className="input-field py-2 text-sm bg-neutral-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary py-3.5 px-6 font-bold flex items-center gap-2 shadow"
                  >
                    <FiPlus className="w-5 h-5" />
                    {locale === 'en' ? 'List Branded Feed' : 'آفیشل پروڈکٹ شامل کریں'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-1 bg-amber-50/50 border border-amber-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-900">
                  <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <h4 className="font-extrabold text-sm">{locale === 'en' ? 'Feed Regulations Policy' : 'خوراک پالیسی کے اصول'}</h4>
                </div>
                <p className="text-amber-800 text-xs leading-relaxed font-bold">
                  {locale === 'en'
                    ? "Under Petstan Terms of Service, individual pet sellers are STRICTLY FORBIDDEN from selling animal food/feed. Official pet food brands listed here are exclusively distributed under the Petstan Official Store."
                    : "پٹس ٹان کی پالیسی کے تحت عام پالتو دکانداروں کو خوراک (اینمل فیڈ) فروخت کرنے کی سخت ممانعت ہے۔ یہ فیڈ پروڈکٹس پٹس ٹان ایڈمن کی نگرانی میں آفیشل برانڈ کے تحت فروخت کی جا رہی ہیں۔"}
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Register Admin */}
          {activeTab === 'register-admin' && (
            <div className="max-w-md bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
                👤 {getTranslation('adminRegAdmin', locale)}
              </h2>
              <form onSubmit={handleRegisterAdmin} className="space-y-4 font-bold text-sm text-neutral-700">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-600">Full Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="input-field py-2 bg-neutral-50/50 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-600">Email Address</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="input-field py-2 bg-neutral-50/50 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-600">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50/50 text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-3 font-bold flex items-center justify-center gap-2 shadow"
                >
                  <FiUserPlus className="w-5 h-5" />
                  Register Admin Account
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
