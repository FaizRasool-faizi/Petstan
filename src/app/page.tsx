'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SearchFilters from '@/components/SearchFilters';
import PetCard from '@/components/PetCard';
import TopSellers from '@/components/TopSellers';
import Footer from '@/components/Footer';
import PetStories from '@/components/PetStories';
import FlashSaleTimer from '@/components/FlashSaleTimer';
import { Pet, Seller, SearchFilters as SearchFiltersType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { FiClock, FiEye, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';
import { playCategorySound } from '@/lib/soundEffects';

// Mock Data
const mockPets: Pet[] = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    name: 'Golden Retriever Puppy',
    category: 'dogs',
    breed: 'Golden Retriever',
    price: 45000,
    stock: 3,
    description: 'Healthy and playful Golden Retriever puppy',
    images: ['https://images.unsplash.com/photo-1633722715463-d30628519d00?w=400&h=400&fit=crop'],
    age: '3 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: false,
    status: 'active',
    views: 234,
    likes: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sellerId: 's2',
    sellerName: 'Pet Paradise',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    name: 'Persian Cat',
    category: 'cats',
    breed: 'Persian',
    price: 35000,
    stock: 2,
    description: 'Beautiful white Persian cat with blue eyes',
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop'],
    age: '4 months',
    healthStatus: 'Excellent',
    gender: 'female',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 189,
    likes: 67,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    sellerId: 's3',
    sellerName: 'Exotic Birds Hub',
    name: 'African Grey Parrot',
    category: 'birds',
    breed: 'African Grey',
    price: 85000,
    stock: 1,
    description: 'Intelligent talking parrot, hand-raised',
    images: ['https://images.unsplash.com/photo-1444464666175-1642a9f33e12?w=400&h=400&fit=crop'],
    age: '1 year',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 456,
    likes: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    name: 'German Shepherd',
    category: 'dogs',
    breed: 'German Shepherd',
    price: 55000,
    stock: 2,
    description: 'Well-trained guard dog, excellent temperament',
    images: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop'],
    age: '6 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 567,
    likes: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    sellerId: 's2',
    sellerName: 'Pet Paradise',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    name: 'Siamese Kitten',
    category: 'cats',
    breed: 'Siamese',
    price: 28000,
    stock: 4,
    description: 'Adorable Siamese kitten with striking blue eyes',
    images: ['https://images.unsplash.com/photo-1513360371669-4a0eb3a4b3e9?w=400&h=400&fit=crop'],
    age: '2 months',
    healthStatus: 'Excellent',
    gender: 'female',
    vaccinated: true,
    trained: false,
    status: 'active',
    views: 345,
    likes: 78,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    sellerId: 's4',
    sellerName: 'Aqua World',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller4',
    name: 'Betta Fish',
    category: 'fish',
    breed: 'Betta Splendens',
    price: 1500,
    stock: 10,
    description: 'Colorful Betta fish with vibrant fins',
    images: ['https://images.unsplash.com/photo-1534080564897-61f3b9ad9a0e?w=400&h=400&fit=crop'],
    age: '6 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: false,
    trained: false,
    status: 'active',
    views: 123,
    likes: 34,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSellers: Seller[] = [
  {
    id: 's1',
    userId: 'u1',
    storeName: 'Paws & Claws Store',
    storeDescription: 'Premium quality dogs and cats with health guarantee',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    bannerImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=300&fit=crop',
    rating: 4.8,
    totalSales: 156,
    totalRevenue: 2340000,
    joinedDate: new Date('2024-01-15'),
    contactInfo: {
      phone: '+92 300 1234567',
      email: 'pawsclaws@petstan.pk',
      address: 'Karachi, Pakistan',
    },
  },
  {
    id: 's2',
    userId: 'u2',
    storeName: 'Pet Paradise',
    storeDescription: 'Your one-stop shop for exotic and domestic pets',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    bannerImage: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1200&h=300&fit=crop',
    rating: 4.9,
    totalSales: 203,
    totalRevenue: 3120000,
    joinedDate: new Date('2023-11-20'),
    contactInfo: {
      phone: '+92 321 9876543',
      email: 'paradise@petstan.pk',
      address: 'Lahore, Pakistan',
    },
  },
  {
    id: 's3',
    userId: 'u3',
    storeName: 'Exotic Birds Hub',
    storeDescription: 'Specialized in rare and exotic bird species',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller3',
    bannerImage: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=1200&h=300&fit=crop',
    rating: 4.7,
    totalSales: 89,
    totalRevenue: 1890000,
    joinedDate: new Date('2024-03-10'),
    contactInfo: {
      phone: '+92 333 5551234',
      email: 'birds@petstan.pk',
      address: 'Islamabad, Pakistan',
    },
  },
];

export default function Home() {
  const [filteredPets, setFilteredPets] = useState<Pet[]>(mockPets);

  const handleFilterChange = (filters: SearchFiltersType) => {
    let filtered = [...mockPets];

    if (filters.category) {
      filtered = filtered.filter((pet) => pet.category === filters.category);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((pet) => pet.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((pet) => pet.price <= filters.maxPrice!);
    }

    if (filters.gender) {
      filtered = filtered.filter((pet) => pet.gender === filters.gender);
    }

    if (filters.vaccinated !== undefined) {
      filtered = filtered.filter((pet) => pet.vaccinated === filters.vaccinated);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          filtered.sort((a, b) => b.views - a.views);
          break;
        case 'newest':
        default:
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
    }

    setFilteredPets(filtered);
  };

  return (
    <main className="min-h-screen bg-neutral-50 overflow-hidden">
      <Toaster position="top-right" />
      <Navbar />
      <HeroSection />
      
      {/* Pet Stories - Engaging emotional hook */}
      <PetStories />

      {/* Visual Category Quick-Links */}
      <section className="py-10 bg-white border-b border-neutral-100 shadow-sm z-10 relative">
        <div className="container-custom">
          <div className="flex justify-start md:justify-center gap-6 md:gap-12 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x">
            {[
              { id: 'dogs', icon: '🐕', name: 'Dogs', color: 'bg-orange-100 text-orange-600' },
              { id: 'cats', icon: '🐈', name: 'Cats', color: 'bg-purple-100 text-purple-600' },
              { id: 'birds', icon: '🦜', name: 'Birds', color: 'bg-sky-100 text-sky-600' },
              { id: 'fish', icon: '🐠', name: 'Fish', color: 'bg-blue-100 text-blue-600' },
              { id: 'goats', icon: '🐐', name: 'Goats', color: 'bg-emerald-100 text-emerald-600' },
              { id: 'horses', icon: '🐴', name: 'Horses', color: 'bg-amber-100 text-amber-600' },
              { id: 'reptiles', icon: '🦎', name: 'Reptiles', color: 'bg-teal-100 text-teal-600' },
              { id: 'feed', icon: '🦴', name: 'Accessories', color: 'bg-rose-100 text-rose-600' },
            ].map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playCategorySound(cat.id)}
                onClick={() => handleFilterChange({ category: cat.id as any })}
                className="flex flex-col items-center gap-3 snap-center cursor-pointer group"
              >
                <div className={`w-20 h-20 rounded-full ${cat.color} flex items-center justify-center text-4xl shadow-md group-hover:shadow-lg transition-all border-4 border-white`}>
                  {cat.icon}
                </div>
                <span className="font-extrabold text-sm text-neutral-700">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <SearchFilters onFilterChange={handleFilterChange} />

      {/* Flash Deals / Urgency hook */}
      <section className="py-12 bg-gradient-to-r from-rose-500 to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paw-pattern.png')]"></div>
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="flex-1 space-y-3 text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-black flex items-center justify-center md:justify-start gap-3 tracking-tight">
                ⚡ Flash Deals 
                <span className="text-xs font-black bg-white text-rose-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-md">Ends soon</span>
             </h2>
             <p className="text-white/90 font-medium text-lg max-w-xl">Adopt your new best friend today and get up to 50% off adoption fees and free premium accessories!</p>
           </div>
           <FlashSaleTimer />
        </div>
      </section>

      {/* Top Sellers Section */}
      <TopSellers sellers={mockSellers} />

      {/* Featured Pets Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Featured Pets
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Browse our collection of healthy and happy pets waiting for their forever homes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet, index) => (
              <PetCard key={pet.id} pet={pet} index={index} />
            ))}
          </div>

          {filteredPets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200 border-dashed"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl font-bold text-neutral-800">No pets found matching your filters</p>
              <p className="text-neutral-500 font-medium mt-2">Try adjusting your search criteria or explore other categories</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Recently Viewed - Retargeting hook */}
      <section className="py-12 bg-neutral-100 border-t border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center gap-2 mb-8">
            <FiEye className="w-6 h-6 text-neutral-500" />
            <h2 className="text-2xl font-extrabold text-neutral-900">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {mockPets.slice(0, 5).reverse().map((pet, idx) => (
                <div key={`recent-${pet.id}`} className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                    <Image src={pet.images[0]} alt={pet.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 truncate">{pet.name}</h4>
                  <p className="text-primary-600 font-extrabold text-sm mt-1">Rs {pet.price.toLocaleString()}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
