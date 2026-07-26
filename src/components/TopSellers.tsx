'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import { Seller } from '@/types';

interface TopSellersProps {
  sellers: Seller[];
}

export default function TopSellers({ sellers }: TopSellersProps) {
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
    <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
            <FiTrendingUp className="w-4 h-4" />
            Top Performers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Last Month&apos;s Top Sellers
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore our community&apos;s most trusted sellers and their highly-rated pet shops.
          </p>
        </motion.div>

        {/* Sellers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sellers.map((seller, index) => (
            <motion.div key={seller.id} variants={itemVariants}>
              <Link href={`/sellers/${seller.id}`} className="block h-full">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card overflow-hidden cursor-pointer group relative flex flex-col h-full"
                >
                  {/* Rank Badge */}
                  {index < 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                            : 'bg-gradient-to-br from-orange-400 to-orange-600'
                        }`}
                      >
                        #{index + 1}
                      </div>
                    </div>
                  )}

                  {/* Banner Image */}
                  <div className="relative h-32 bg-gradient-to-r from-primary-400 to-primary-600 overflow-hidden">
                    {seller.bannerImage ? (
                      <Image
                        src={seller.bannerImage}
                        alt={seller.storeName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600" />
                    )}
                  </div>

                  {/* Logo */}
                  <div className="relative -mt-12 mb-4 flex justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                      {seller.logo ? (
                        <Image
                          src={seller.logo}
                          alt={seller.storeName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                          {seller.storeName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {seller.storeName}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2">
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
                      <span className="text-sm font-semibold text-neutral-700">
                        {seller.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-1 text-primary-600 mb-1">
                          <FiShoppingBag className="w-4 h-4" />
                          <p className="text-2xl font-bold">{seller.totalSales}</p>
                        </div>
                        <p className="text-xs text-neutral-600 font-semibold uppercase tracking-wide">Total Sales</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 line-clamp-2 px-2 flex-1">
                      {seller.storeDescription}
                    </p>

                    {/* View Store Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn-primary mt-4"
                    >
                      View Store
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/sellers">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline text-lg px-8 py-3"
            >
              View All Sellers
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
