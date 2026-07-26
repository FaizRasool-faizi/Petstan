'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import Image from 'next/image';
import { FiStar, FiPhone, FiMail, FiMapPin, FiClock, FiAward, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { useDataStore, useUIStore, useAuthStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SellerShopPage() {
  const { id } = useParams() as { id: string };
  const { pets, sellers, reviews, addReview } = useDataStore();
  const { locale } = useUIStore();
  const { user } = useAuthStore();
  const isRtl = locale === 'ur';

  // Find Seller
  const seller = sellers.find((s) => s.id === id);

  // Reviews for this seller
  const sellerReviews = reviews.filter((r) => r.sellerId === id);

  // Pets for this seller (sorted by date/time descending)
  const sellerPets = pets
    .filter((p) => p.sellerId === id && p.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');

  // Reset name when user state loads
  useEffect(() => {
    if (user) {
      setReviewerName(user.name);
    }
  }, [user]);

  if (!seller) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-neutral-900">
            {locale === 'en' ? 'Store Not Found' : 'دکان نہیں ملی'}
          </h1>
          <Link href="/sellers" className="btn-primary inline-block">
            {locale === 'en' ? 'Back to Sellers' : 'دکانوں پر واپس جائیں'}
          </Link>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error(locale === 'en' ? 'Comment is required' : 'تبصرہ لکھنا ضروری ہے');
      return;
    }

    const newReview = {
      id: 'rev_' + Date.now(),
      orderId: 'ORD_' + Math.floor(Math.random() * 9000 + 1000),
      buyerId: user?.id || 'guest_' + Date.now(),
      buyerName: reviewerName.trim() || (locale === 'en' ? 'Anonymous Buyer' : 'نامعلوم خریدار'),
      buyerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewerName || 'guest'}`,
      sellerId: seller.id,
      petId: sellerPets[0]?.id || 'N/A',
      rating,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    addReview(newReview);
    toast.success(locale === 'en' ? 'Review submitted successfully!' : 'رائے کامیابی سے شامل کر دی گئی!');
    setComment('');
    setRating(5);
  };

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Store Banner */}
      <div className="relative h-64 md:h-80 w-full pt-20 bg-neutral-200">
        {seller.bannerImage ? (
          <Image
            src={seller.bannerImage}
            alt={seller.storeName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Store Profile Intro Card */}
      <div className="container-custom relative z-10 -mt-16 mb-8">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Logo Avatar */}
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0">
            {seller.logo ? (
              <Image
                src={seller.logo}
                alt={seller.storeName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-extrabold">
                {seller.storeName.charAt(0)}
              </div>
            )}
          </div>

          {/* Intro Information */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-neutral-900">
                  {seller.storeName}
                </h1>
                <p className="text-neutral-500 font-semibold mt-1">
                  {locale === 'en' ? 'Store Owner' : 'دکان کا مالک'}: {seller.contactInfo.phone ? seller.storeDescription.split(' ')[0] : 'Faiz'}
                </p>
              </div>

              {/* Rating badge & Contact */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center md:justify-start gap-2 bg-secondary-50 border border-secondary-100 rounded-xl px-4 py-2 w-fit">
                  <FiStar className="w-5 h-5 fill-secondary-500 text-secondary-500" />
                  <span className="font-extrabold text-secondary-800 text-lg">
                    {seller.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-secondary-600 font-bold">
                    ({sellerReviews.length} {locale === 'en' ? 'Reviews' : 'تبصرے'})
                  </span>
                </div>
                <Link href={`/chat?userId=${seller.id}`} className="btn-primary py-2 px-5 flex items-center gap-2 text-sm shadow-sm rounded-xl">
                  <FiMessageSquare className="w-4 h-4" />
                  {locale === 'en' ? 'Message Seller' : 'پیغام بھیجیں'}
                </Link>
              </div>
            </div>

            <p className="text-neutral-600 text-md leading-relaxed font-semibold max-w-3xl">
              {seller.storeDescription}
            </p>

            {/* Timings, Address, Reg details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-sm font-bold text-neutral-700">
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <FiMapPin className="text-primary-500 w-5 h-5 flex-shrink-0" />
                <span>{seller.contactInfo.address}</span>
              </div>
              {seller.shopTimings && (
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <FiClock className="text-primary-500 w-5 h-5 flex-shrink-0" />
                  <span>
                    {locale === 'en' ? 'Shop Timings' : 'دکان کے اوقات'}: {seller.shopTimings}
                  </span>
                </div>
              )}
              {seller.registrationNumber && (
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <FiAward className="text-primary-500 w-5 h-5 flex-shrink-0" />
                  <span>
                    {locale === 'en' ? 'License No' : 'رجسٹریشن نمبر'}: {seller.registrationNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Warning suspension notification */}
            {seller.isSuspended && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3 mt-4 text-left">
                <FiInfo className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-xs font-bold leading-relaxed">
                  {locale === 'en'
                    ? "Warning: This store orders intake is currently disabled due to fraud claims."
                    : "تبصرہ: دھوکہ دہی کی وجہ سے اس دکان کے آرڈرز عارضی طور پر روک دیئے گئے ہیں۔"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="container-custom pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Right Column: Store Ads Inventory */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-extrabold text-neutral-900 pb-2 border-b border-neutral-200 flex items-center gap-2">
              🐾 {locale === 'en' ? 'Current Advertisements' : 'دستیاب پالتو جانور'}
              <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {sellerPets.length}
              </span>
            </h2>

            {sellerPets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerPets.map((pet, idx) => (
                  <PetCard key={pet.id} pet={pet} index={idx % 4} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl">
                <p className="text-neutral-500 font-bold">
                  {locale === 'en' ? 'This store has no active advertisements.' : 'اس دکان کا کوئی فعال اشتہار دستیاب نہیں ہے۔'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Reviews and Rating Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store Review Submit Box */}
            <div className="card border border-neutral-200 shadow-sm space-y-6">
              <h3 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
                ✍️ {locale === 'en' ? 'Write a Store Review' : 'اپنی رائے دیں'}
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Reviewer Name */}
                {!user && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-800">
                      {locale === 'en' ? 'Your Name' : 'آپ کا نام'}
                    </label>
                    <input
                      type="text"
                      placeholder={locale === 'en' ? 'Enter your name' : 'اپنا نام درج کریں'}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                )}

                {/* Stars select */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-800">
                    {locale === 'en' ? 'Rating stars' : 'ریٹنگ ستاروں کا انتخاب'}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <FiStar
                          className={`w-8 h-8 transition-colors ${
                            star <= rating
                              ? 'fill-secondary-500 text-secondary-500'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-800">
                    {locale === 'en' ? 'Review Comment' : 'تبصرہ / رائے'}
                  </label>
                  <textarea
                    placeholder={locale === 'en' ? 'Write your experience with this seller...' : 'اس فروخت کنندہ کے بارے میں اپنی رائے لکھیں...'}
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-3 font-bold shadow-sm">
                  {locale === 'en' ? 'Submit Store Review' : 'رائے جمع کروائیں'}
                </button>
              </form>
            </div>

            {/* Historical Reviews List */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center gap-2">
                <FiMessageSquare className="text-primary-600 w-5 h-5" />
                {locale === 'en' ? 'Customer Reviews' : 'گاہکوں کے تبصرے'}
                <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {sellerReviews.length}
                </span>
              </h3>

              {sellerReviews.length > 0 ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                  {sellerReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center overflow-hidden">
                            {rev.buyerAvatar ? (
                              <Image src={rev.buyerAvatar} alt="user avatar" width={32} height={32} />
                            ) : (
                              <span className="text-xs font-bold text-neutral-600">G</span>
                            )}
                          </div>
                          <span className="font-bold text-neutral-800 text-sm">{rev.buyerName}</span>
                        </div>
                        {/* Rating stars display */}
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? 'fill-secondary-500 text-secondary-500'
                                  : 'text-neutral-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
                        {rev.comment}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-bold">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white border border-neutral-200 rounded-2xl">
                  <p className="text-xs text-neutral-500 font-semibold">
                    {locale === 'en' ? 'No reviews yet. Be the first!' : 'ابھی تک کوئی تبصرہ نہیں ہے۔ پہلا تبصرہ آپ کریں!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
