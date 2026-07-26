'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SearchFilters from '@/components/SearchFilters';
import PetCard from '@/components/PetCard';
import TopSellers from '@/components/TopSellers';
import Footer from '@/components/Footer';
import { Pet, Seller, SearchFilters as SearchFiltersType } from '@/types';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

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
    <main className="min-h-screen bg-neutral-50">
      <Toaster position="top-right" />
      <Navbar />
      <HeroSection />
      <SearchFilters onFilterChange={handleFilterChange} />

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
              className="text-center py-16"
            >
              <p className="text-2xl text-neutral-600">No pets found matching your filters</p>
              <p className="text-neutral-500 mt-2">Try adjusting your search criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
