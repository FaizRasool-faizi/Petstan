'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import SearchFilters from '@/components/SearchFilters';
import { Pet, SearchFilters as SearchFiltersType } from '@/types';
import { useDataStore, useUIStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function AllPetsPage() {
  const { pets, sellers } = useDataStore();
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';

  // Filter state
  const [activeFilters, setActiveFilters] = useState<SearchFiltersType>({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    gender: undefined,
    vaccinated: undefined,
    sortBy: 'newest',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [storeQuery, setStoreQuery] = useState('');

  // Pagination limit
  const [displayLimit, setDisplayLimit] = useState(30);

  // Filtered lists
  const [filteredPets, setFilteredPets] = useState<Pet[]>(pets);

  // Apply filters
  useEffect(() => {
    let result = [...pets];

    // Filter out pets belonging to suspended sellers
    result = result.filter(pet => {
      const seller = sellers.find(s => s.id === pet.sellerId);
      return !seller?.isSuspended;
    });

    // 1. Text Search Query (Matches breed or name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (pet) =>
          pet.name.toLowerCase().includes(q) ||
          pet.breed.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (activeFilters.category) {
      result = result.filter((pet) => pet.category === activeFilters.category);
    }

    // 3. Price range
    if (activeFilters.minPrice !== undefined) {
      result = result.filter((pet) => pet.price >= activeFilters.minPrice!);
    }
    if (activeFilters.maxPrice !== undefined) {
      result = result.filter((pet) => pet.price <= activeFilters.maxPrice!);
    }

    // 4. Gender
    if (activeFilters.gender) {
      result = result.filter((pet) => pet.gender === activeFilters.gender);
    }

    // 5. Vaccination
    if (activeFilters.vaccinated !== undefined) {
      result = result.filter((pet) => pet.vaccinated === activeFilters.vaccinated);
    }

    // 6. Location
    if (locationQuery.trim()) {
      const loc = locationQuery.toLowerCase();
      result = result.filter((pet) => {
        const seller = sellers.find((s) => s.id === pet.sellerId);
        return seller?.contactInfo?.address.toLowerCase().includes(loc);
      });
    }

    // 7. Store Search
    if (storeQuery.trim()) {
      const sq = storeQuery.toLowerCase();
      result = result.filter((pet) =>
        pet.sellerName.toLowerCase().includes(sq)
      );
    }

    // 8. Sorting (Defaults to newest)
    switch (activeFilters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        // Sort by date object/timestamp
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredPets(result);
  }, [pets, sellers, searchQuery, activeFilters, locationQuery, storeQuery]);

  const handleFilterChange = (filters: SearchFiltersType) => {
    setActiveFilters(filters);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 15);
  };

  const displayedPets = filteredPets.slice(0, displayLimit);

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-50">
      <Toaster position="top-right" />
      <Navbar />

      {/* Header Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary-50 to-neutral-50 border-b border-neutral-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
              {locale === 'en' ? 'All Pet Advertisements' : 'پالتو جانوروں کے تمام اشتہارات'}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-medium">
              {locale === 'en'
                ? 'Browse through the largest directory of pets and feed listings in Pakistan. Connect directly with sellers.'
                : 'پاکستان بھر سے پالتو جانوروں اور ان کی خوراک کے اشتہارات دیکھیں۔ براہ راست دکانداروں سے رابطہ کریں۔'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Detailed Search Controls */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="card space-y-6 sticky top-24 border border-neutral-200 shadow-sm">
              <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                <h3 className="font-extrabold text-neutral-900 text-xl flex items-center gap-2">
                  🔍 {locale === 'en' ? 'Search Filters' : 'تلاش کے فلٹرز'}
                </h3>
              </div>

              {/* Text Query */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  {locale === 'en' ? 'Pet Name / Breed' : 'نام یا نسل'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'e.g. Parrot, Persian cat...' : 'مثال کے طور پر طوطا، بلی...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field py-2 text-sm bg-neutral-55"
                />
              </div>

              {/* City / Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  {locale === 'en' ? 'City / Location' : 'شہر / جگہ'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'e.g. Lahore, Karachi...' : 'مثال کے طور پر لاہور، کراچی...'}
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>

              {/* Store Name Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  {locale === 'en' ? 'Store Name' : 'دکان کا نام'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'e.g. Paws Claws...' : 'دکان کا نام درج کریں...'}
                  value={storeQuery}
                  onChange={(e) => setStoreQuery(e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  {locale === 'en' ? 'Pet Category' : 'قسم'}
                </label>
                <select
                  value={activeFilters.category || ''}
                  onChange={(e) =>
                    handleFilterChange({
                      ...activeFilters,
                      category: e.target.value ? (e.target.value as any) : undefined,
                    })
                  }
                  className="input-field text-sm"
                >
                  <option value="">{locale === 'en' ? 'All Categories' : 'تمام اقسام'}</option>
                  <option value="dogs">{getTranslation('catDogs', locale)}</option>
                  <option value="cats">{getTranslation('catCats', locale)}</option>
                  <option value="birds">{getTranslation('catBirds', locale)}</option>
                  <option value="fish">{getTranslation('catFish', locale)}</option>
                  <option value="rabbits">{getTranslation('catRabbits', locale)}</option>
                  <option value="hamsters">{getTranslation('catHamsters', locale)}</option>
                  <option value="reptiles">{getTranslation('catReptiles', locale)}</option>
                  <option value="feed">{getTranslation('catFeed', locale)}</option>
                  <option value="other">{getTranslation('catOther', locale)}</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  {getTranslation('filterSortBy', locale)}
                </label>
                <select
                  value={activeFilters.sortBy || 'newest'}
                  onChange={(e) =>
                    handleFilterChange({
                      ...activeFilters,
                      sortBy: e.target.value as any,
                    })
                  }
                  className="input-field text-sm"
                >
                  <option value="newest">{getTranslation('filterSortNewest', locale)}</option>
                  <option value="price-low">{getTranslation('filterSortPriceLow', locale)}</option>
                  <option value="price-high">{getTranslation('filterSortPriceHigh', locale)}</option>
                  <option value="popular">{getTranslation('filterSortPopular', locale)}</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Right Grid: Pet Ads */}
          <div className="lg:col-span-3 space-y-8">
            {/* Top filters banner */}
            <SearchFilters activeFilters={activeFilters} onFilterChange={handleFilterChange} />

            {/* Pets Grid */}
            {displayedPets.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedPets.map((pet, idx) => (
                    <PetCard key={pet.id} pet={pet} index={idx % 6} />
                  ))}
                </div>

                {/* Load More Button */}
                {filteredPets.length > displayedPets.length && (
                  <div className="flex justify-center pt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLoadMore}
                      className="btn-primary py-3 px-8 text-md font-bold flex items-center gap-2"
                    >
                      {locale === 'en' ? 'Load More Advertisements' : 'مزید اشتہارات دیکھیں'}
                    </motion.button>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-3"
              >
                <p className="text-2xl font-bold text-neutral-800">
                  {getTranslation('noPetsFound', locale)}
                </p>
                <p className="text-neutral-500 font-medium">
                  {getTranslation('noPetsSub', locale)}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
