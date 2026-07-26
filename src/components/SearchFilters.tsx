'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { SearchFilters as SearchFiltersType, PetCategory } from '@/types';
import { playCategorySound } from '@/lib/soundEffects';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFiltersType) => void;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    gender: undefined,
    vaccinated: undefined,
    trained: undefined,
    sortBy: 'newest',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { value: PetCategory; label: string; icon: string }[] = [
    { value: 'dogs', label: 'Dogs', icon: '🐕' },
    { value: 'cats', label: 'Cats', icon: '🐈' },
    { value: 'birds', label: 'Birds', icon: '🦜' },
    { value: 'fish', label: 'Fish', icon: '🐠' },
    { value: 'rabbits', label: 'Rabbits', icon: '🐰' },
    { value: 'hamsters', label: 'Hamsters', icon: '🐹' },
    { value: 'reptiles', label: 'Reptiles', icon: '🦎' },
    { value: 'other', label: 'Other', icon: '🐾' },
  ];

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFiltersType = {
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      gender: undefined,
      vaccinated: undefined,
      trained: undefined,
      sortBy: 'newest',
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    onFilterChange(clearedFilters);
  };

  return (
    <div className="w-full bg-white shadow-sm border-b border-neutral-200 sticky top-20 z-40">
      <div className="container-custom py-6">
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for pets by name, breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiFilter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </motion.button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-4">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => playCategorySound(category.value)}
              onClick={() =>
                handleFilterChange(
                  'category',
                  filters.category === category.value ? undefined : category.value
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                filters.category === category.value
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-primary-400'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Advanced Filters */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-neutral-200"
          >
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price Range (PKR)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Gender</label>
              <select
                value={filters.gender || ''}
                onChange={(e) =>
                  handleFilterChange('gender', e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Vaccinated */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vaccinated
              </label>
              <select
                value={filters.vaccinated === undefined ? '' : filters.vaccinated.toString()}
                onChange={(e) =>
                  handleFilterChange(
                    'vaccinated',
                    e.target.value === '' ? undefined : e.target.value === 'true'
                  )
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Clear Filters */}
        {(filters.category || filters.minPrice || filters.maxPrice || filters.gender || searchQuery) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-4"
          >
            <FiX className="w-4 h-4" />
            Clear all filters
          </motion.button>
        )}
      </div>
    </div>
  );
}
