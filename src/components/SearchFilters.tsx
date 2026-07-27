'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { SearchFilters as SearchFiltersType, PetCategory } from '@/types';

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



        {/* Advanced Filters */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-neutral-200"
          >
            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-neutral-700">Max Price</label>
                <span className="text-primary-600 font-extrabold text-sm">
                  Rs {filters.maxPrice ? filters.maxPrice.toLocaleString() : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={filters.maxPrice || 200000}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600 mb-2"
              />
              <div className="flex justify-between text-xs text-neutral-400 font-medium">
                <span>Rs 1k</span>
                <span>Rs 200k+</span>
              </div>
            </div>

            {/* Gender Pills */}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Gender</label>
              <div className="flex gap-2">
                {[
                  { id: undefined, label: 'All' },
                  { id: 'male', label: 'Male ♂' },
                  { id: 'female', label: 'Female ♀' }
                ].map((g) => (
                  <button
                    key={g.id || 'all'}
                    onClick={() => handleFilterChange('gender', g.id)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                      filters.gender === g.id
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vaccinated Pills */}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Vaccinated Status
              </label>
              <div className="flex gap-2">
                {[
                  { id: undefined, label: 'All' },
                  { id: true, label: 'Yes 💉' },
                  { id: false, label: 'No' }
                ].map((v) => (
                  <button
                    key={v.id === undefined ? 'all' : v.id.toString()}
                    onClick={() => handleFilterChange('vaccinated', v.id)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                      filters.vaccinated === v.id
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-green-300'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 bg-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-neutral-700"
              >
                <option value="newest">🔥 Newest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="popular">⭐ Most Popular</option>
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
