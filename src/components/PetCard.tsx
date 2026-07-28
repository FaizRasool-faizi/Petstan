'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiStar, FiMapPin, FiShield, FiCheckCircle } from 'react-icons/fi';
import { Pet } from '@/types';
import { useCartStore, useUIStore } from '@/lib/store';
import { useState } from 'react';
import { getTranslation } from '@/utils/translations';
import toast from 'react-hot-toast';

interface PetCardProps {
  pet: Pet;
  index?: number;
}

export default function PetCard({ pet, index = 0 }: PetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCartStore();
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(pet, 1);
    toast.success(`${pet.name} added to cart!`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
      },
    },
  };

  const displayGender = pet.gender === 'male'
    ? getTranslation('filterGenderMale', locale)
    : getTranslation('filterGenderFemale', locale);

  const displayStatus = pet.status === 'active'
    ? getTranslation('petDetailAvailable', locale)
    : getTranslation('petDetailSold', locale);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="card overflow-hidden cursor-pointer group flex flex-col h-full border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Image Container */}
        <Link href={`/pets/${pet.id}`}>
          <div className="relative h-64 overflow-hidden bg-neutral-200 rounded-lg mb-4">
            <Image
              src={pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop'}
              alt={pet.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Status Badge */}
            <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
              <span className={`badge ${pet.status === 'active' ? 'badge-success' : 'badge-warning'} shadow-sm`}>
                {displayStatus}
              </span>
            </div>

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10`}
            >
              <FiHeart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-600'
                }`}
              />
            </motion.button>

            {/* View Count */}
            <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm`}>
              👁️ {pet.views}
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Pet Name & Category */}
            <Link href={`/pets/${pet.id}`}>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug flex items-center gap-1">
                  {pet.name}
                  {pet.isVerified && (
                    <FiShield className="w-4 h-4 text-green-500" title="Verified Pet" />
                  )}
                </h3>
                <p className="text-sm text-neutral-500 font-semibold">{pet.breed}</p>
              </div>
            </Link>

            {/* Seller Info (Linked) */}
            <div className="flex items-center gap-2 text-sm border-t border-neutral-100 pt-2.5">
              {pet.sellerLogo && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-neutral-200">
                  <Image
                    src={pet.sellerLogo}
                    alt={pet.sellerName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Link href={`/sellers/${pet.sellerId}`} className="flex items-center gap-1 text-neutral-700 font-bold hover:text-primary-600 hover:underline">
                {pet.sellerName}
                <FiCheckCircle className="w-4 h-4 text-primary-500" title="Verified: CNIC & Shop Address Confirmed" />
              </Link>
            </div>

            {/* Pet Details */}
            {pet.category !== 'feed' ? (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full font-semibold">
                  {getTranslation('petCardAge', locale)}: {pet.age}
                </span>
                <span className="px-2.5 py-1 bg-secondary-50 text-secondary-700 rounded-full font-semibold">
                  {displayGender}
                </span>
                {pet.vaccinated && (
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-semibold">
                    💉 {getTranslation('petCardVaccinated', locale)}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 bg-secondary-50 text-secondary-700 rounded-full font-semibold">
                  🏷️ {getTranslation('adminFeedBrand', locale)}
                </span>
              </div>
            )}

            {/* Buyer Protection */}
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-green-700 bg-green-50/50 border border-green-200 px-2 py-1 rounded w-fit">
              <FiShield className="w-3 h-3" />
              <span title="Payment held until safe delivery">Buyer Protection</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < 4
                        ? 'fill-secondary-500 text-secondary-500'
                        : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-500">(4.8 rating)</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <div>
              <p className="text-2xl font-extrabold text-primary-600">
                Rs {pet.price.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500 font-semibold">
                {locale === 'en' ? 'Stock' : 'سٹاک'}: {pet.stock}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={pet.status !== 'active'}
              className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
