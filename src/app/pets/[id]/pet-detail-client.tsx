'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiShoppingCart, FiStar, FiPhone, FiMail, FiCheck, FiInfo, FiShield, FiCheckCircle, FiFileText, FiMessageSquare } from 'react-icons/fi';
import { useCartStore, useUIStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewSection from '@/components/ReviewSection';
import CrossSell from '@/components/CrossSell';

import { Pet } from '@/types';

interface PetDetailClientProps {
  pet: Pet | undefined;
}

export default function PetDetailClient({ pet }: PetDetailClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!pet) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-neutral-900">
            {locale === 'en' ? 'Listing Not Found' : 'اشتہار نہیں ملا'}
          </h1>
          <p className="text-neutral-600 font-medium">
            {locale === 'en' ? "The pet listing you are looking for doesn't exist or is removed." : "جس پالتو جانور کا اشتہار آپ تلاش کر رہے ہیں وہ موجود نہیں ہے۔"}
          </p>
          <Link href="/pets" className="btn-primary inline-block">
            {locale === 'en' ? 'Back to Listings' : 'اشتہارات پر واپس جائیں'}
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(pet, quantity);
    toast.success(`${pet.name} added to cart!`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const displayGender = pet.gender === 'male'
    ? getTranslation('filterGenderMale', locale)
    : getTranslation('filterGenderFemale', locale);

  const displayStatus = pet.status === 'active'
    ? getTranslation('petDetailAvailable', locale)
    : getTranslation('petDetailSold', locale);

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="container-custom py-8 pt-28">
        {/* Back Link */}
        <Link href="/pets" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-bold">
          <FiArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{locale === 'en' ? 'Back to Listings' : 'اشتہارات پر واپس جائیں'}</span>
        </Link>

        {/* Disclaimer Alert box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8 flex gap-3">
          <FiInfo className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-amber-900 text-sm">
              {getTranslation('cartDisclaimerTitle', locale)}
            </h4>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              {getTranslation('cartDisclaimerText', locale)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Column */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative h-[480px] rounded-3xl overflow-hidden bg-neutral-200 border border-neutral-200 shadow-md">
              <Image
                src={pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop'}
                alt={pet.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges overlay */}
              <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
                <span className={`badge ${pet.status === 'active' ? 'badge-success' : 'badge-danger'} py-1.5 px-4 text-sm font-bold shadow`}>
                  {displayStatus}
                </span>
              </div>

              {/* Wishlist Like overlay */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-3.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10`}
              >
                <FiHeart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-600'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Info details */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div className="border-b border-neutral-200 pb-5">
              <h1 className="text-4xl font-extrabold text-neutral-900 mb-2 leading-tight flex items-center gap-3">
                {pet.name}
                {pet.isVerified && (
                  <FiShield className="w-8 h-8 text-green-500" title="Verified Pet" />
                )}
              </h1>
              <p className="text-lg text-neutral-600 font-semibold mb-4">{pet.breed}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-primary-600">
                  Rs {pet.price.toLocaleString()}
                </span>
                {pet.category === 'feed' && <span className="text-neutral-500 font-medium">/{locale === 'en' ? 'pack' : 'پیک'}</span>}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-neutral-100">
                 <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
                   <FiShield className="w-4 h-4" /> 100% Health Guarantee
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
                   <FiCheckCircle className="w-4 h-4" /> Verified Breeder
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-100">
                   <FiHeart className="w-4 h-4" /> Lifetime Support
                 </span>
              </div>
            </div>

            {/* Ratings & reviews */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? 'fill-secondary-500 text-secondary-500' : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-neutral-600 font-medium text-sm">(4.8 rating • 12 reviews)</span>
            </div>

            {/* Core parameters Grid */}
            {pet.category !== 'feed' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                  <p className="text-xs text-neutral-600 mb-1 font-semibold">{getTranslation('petCardAge', locale)}</p>
                  <p className="text-lg font-bold text-neutral-900">{pet.age}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                  <p className="text-xs text-neutral-600 mb-1 font-semibold">{getTranslation('petCardGender', locale)}</p>
                  <p className="text-lg font-bold text-neutral-900">{displayGender}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                  <p className="text-xs text-neutral-600 mb-1 font-semibold">{getTranslation('petDetailHealth', locale)}</p>
                  <p className="text-lg font-bold text-neutral-900">{pet.healthStatus}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                  <p className="text-xs text-neutral-600 mb-1 font-semibold">{getTranslation('petDetailStock', locale)}</p>
                  <p className="text-lg font-bold text-neutral-900">{pet.stock}</p>
                </div>
              </div>
            )}

            {/* Features (Vaccination/Training badges) */}
            {pet.category !== 'feed' && (
              <div className="flex flex-wrap gap-3">
                {pet.vaccinated && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-full font-bold text-sm shadow-sm">
                    <FiCheck className="w-4 h-4" />
                    {getTranslation('petCardVaccinated', locale)}
                  </span>
                )}
                {pet.trained && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-bold text-sm shadow-sm">
                    <FiCheck className="w-4 h-4" />
                    {getTranslation('petCardTrained', locale)}
                  </span>
                )}
                <span className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-full font-bold text-sm shadow-sm">
                  👁️ {pet.views} {locale === 'en' ? 'views' : 'ویوز'}
                </span>
                {pet.healthCertificate && (
                  <a href={pet.healthCertificate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-100 rounded-full font-bold text-sm shadow-sm hover:bg-teal-100 transition-colors">
                    <FiFileText className="w-4 h-4" />
                    {locale === 'en' ? 'Health Certificate' : 'ہیلتھ سرٹیفکیٹ'}
                  </a>
                )}
              </div>
            )}

            {/* Pet description */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <h2 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
                {getTranslation('petDetailAbout', locale)}
              </h2>
              <p className="text-neutral-700 leading-relaxed font-medium">{pet.description}</p>
            </div>

            {/* Seller Info box */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
                {getTranslation('petDetailSellerInfo', locale)}
              </h2>
              <div className="flex items-center gap-4">
                {pet.sellerLogo && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200">
                    <Image
                      src={pet.sellerLogo}
                      alt={pet.sellerName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <Link href={`/sellers/${pet.sellerId}`} className="font-extrabold text-neutral-900 text-lg hover:text-primary-600 hover:underline flex items-center gap-2">
                    {pet.sellerName}
                    <FiCheckCircle className="w-5 h-5 text-primary-500" title="Verified Seller" />
                  </Link>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FiStar className="w-4 h-4 fill-secondary-500 text-secondary-500" />
                    <span className="text-xs text-neutral-600 font-bold">4.8 rating</span>
                  </div>
                </div>
              </div>

              {/* Action Contact buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="tel:+923294642268" className="flex-1">
                  <button className="w-full btn-outline flex items-center justify-center gap-2 py-3 border-neutral-350 hover:bg-neutral-50 text-neutral-700">
                    <FiPhone className="w-4 h-4 text-primary-600" />
                    {getTranslation('petDetailContact', locale)}
                  </button>
                </a>
                <Link href={`/chat?userId=${pet.sellerId}`} className="flex-1">
                  <button className="w-full btn-secondary flex items-center justify-center gap-2 py-3">
                    <FiMessageSquare className="w-4 h-4" />
                    {getTranslation('petDetailMessage', locale)}
                  </button>
                </Link>
              </div>
            </div>

            {/* Add to Cart selection */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-neutral-800 font-bold">
                  {getTranslation('petDetailQuantity', locale)}:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-lg hover:bg-neutral-100 font-bold transition-all"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-extrabold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(pet.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-lg hover:bg-neutral-100 font-bold transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={pet.status !== 'active'}
                className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 shadow-lg shadow-primary-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="w-5 h-5" />
                {getTranslation('petDetailAddToCart', locale)}
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Cross Sell Section */}
        {pet.category !== 'feed' && (
          <CrossSell petCategory={pet.category} />
        )}

        {/* Reviews Section */}
        <div className="mt-12 max-w-4xl">
          <ReviewSection sellerId={pet.sellerId} petId={pet.id} title={locale === 'en' ? 'Reviews & Ratings' : 'رائے اور ریٹنگ'} />
        </div>
      </div>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 z-50 md:hidden"
          >
            <div className="container-custom flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-200">
                   <Image src={pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop'} alt={pet.name} fill className="object-cover" />
                 </div>
                 <div>
                   <p className="font-extrabold text-sm text-neutral-900 truncate w-32">{pet.name}</p>
                   <p className="text-primary-600 font-bold text-sm">Rs {pet.price.toLocaleString()}</p>
                 </div>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={pet.status !== 'active'}
                className="btn-primary flex-1 py-3 px-2 flex justify-center items-center gap-2 rounded-xl shadow-lg shadow-primary-900/20"
              >
                <FiShoppingCart className="w-5 h-5" /> 
                <span className="font-bold">{locale === 'en' ? 'Add' : 'شامل کریں'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
