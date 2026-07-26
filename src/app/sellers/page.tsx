'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiTrendingUp, FiShoppingBag, FiMapPin, FiClock } from 'react-icons/fi';
import { Seller } from '@/types';
import { useDataStore, useUIStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import { motion } from 'framer-motion';

export default function SellersDirectoryPage() {
  const { sellers } = useDataStore();
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';

  // Filter out admin official store for normal directory, or keep all
  const displaySellers = sellers.filter((s) => s.id !== 's_admin');

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary-50 to-neutral-50 border-b border-neutral-100">
        <div className="container-custom text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
              {locale === 'en' ? 'Verified Pet Stores' : 'تصدیق شدہ پالتو جانوروں کی دکانیں'}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-medium">
              {locale === 'en'
                ? 'Discover and buy from the most trusted breeders and pet store shops across Pakistan.'
                : 'پاکستان بھر کے سب سے بااعتماد اور بہترین بریڈرز اور دکانوں سے خریدیں۔'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="container-custom py-16">
        {displaySellers.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displaySellers.map((seller, index) => (
              <motion.div key={seller.id} variants={itemVariants}>
                <Link href={`/sellers/${seller.id}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between h-full relative"
                  >
                    {/* Ban Banner overlay */}
                    {seller.isSuspended && (
                      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
                        <span className="bg-red-600 text-white font-extrabold px-4 py-2 rounded-full text-sm mb-2 shadow-lg">
                          🚫 {locale === 'en' ? 'Store Suspended' : 'دکان معطل ہے'}
                        </span>
                        <p className="text-neutral-200 text-xs font-semibold leading-relaxed">
                          {locale === 'en'
                            ? 'Suspended for 30 days due to policy violation.'
                            : 'پالیسی کی خلاف ورزی کی وجہ سے دکان 30 دن کے لیے معطل ہے۔'}
                        </p>
                      </div>
                    )}

                    <div>
                      {/* Banner Image */}
                      <div className="relative h-32 bg-gradient-to-r from-primary-400 to-primary-600 overflow-hidden">
                        {seller.bannerImage ? (
                          <Image
                            src={seller.bannerImage}
                            alt={seller.storeName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700" />
                        )}
                      </div>

                      {/* Logo Avatar */}
                      <div className="relative -mt-12 mb-4 flex justify-center z-10">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white relative">
                          {seller.logo ? (
                            <Image
                              src={seller.logo}
                              alt={seller.storeName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                              {seller.storeName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info Content */}
                      <div className="px-6 text-center space-y-3 pb-4">
                        <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors leading-tight">
                          {seller.storeName}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(seller.rating)
                                    ? 'fill-secondary-500 text-secondary-500'
                                    : 'text-neutral-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-extrabold text-neutral-700 ml-1">
                            {seller.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Store Description */}
                        <p className="text-sm text-neutral-500 line-clamp-2 h-10 leading-relaxed font-medium">
                          {seller.storeDescription}
                        </p>

                        {/* Store Location & Timings */}
                        <div className="pt-2 border-t border-neutral-100 flex flex-col items-center gap-1.5 text-xs text-neutral-600 font-bold">
                          <div className="flex items-center gap-1.5 justify-center">
                            <FiMapPin className="text-primary-500 flex-shrink-0" />
                            <span>{seller.contactInfo.address.split(',')[0]}</span>
                          </div>
                          {seller.shopTimings && (
                            <div className="flex items-center gap-1.5 justify-center">
                              <FiClock className="text-primary-500 flex-shrink-0" />
                              <span>{seller.shopTimings}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Stats Box */}
                    <div className="px-6 pb-6 pt-4 border-t border-neutral-100 bg-neutral-50/50 rounded-b-2xl">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="border-r border-neutral-200">
                          <div className="flex items-center justify-center gap-1 text-primary-600 mb-0.5">
                            <FiShoppingBag className="w-4 h-4" />
                            <p className="text-lg font-extrabold">{seller.totalSales}</p>
                          </div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            {locale === 'en' ? 'Sales' : 'کل فروخت'}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-extrabold text-primary-600 mb-0.5">
                            Rs {(seller.totalRevenue / 1000).toFixed(0)}K
                          </p>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            {locale === 'en' ? 'Revenue' : 'آمدنی'}
                          </p>
                        </div>
                      </div>
                      <button className="w-full btn-primary py-2.5 text-sm font-bold mt-4 shadow-sm hover:shadow">
                        {getTranslation('heroSellersBtn', locale)}
                      </button>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
            <p className="text-xl text-neutral-500 font-bold">
              {locale === 'en' ? 'No stores registered yet.' : 'کوئی دکان ابھی رجسٹر نہیں ہے۔'}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
