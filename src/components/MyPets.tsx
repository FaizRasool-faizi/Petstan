'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiX,
} from 'react-icons/fi';
import { Pet } from '@/types';
import toast from 'react-hot-toast';

interface MyPetsProps {
  pets: Pet[];
  onAddPet?: () => void;
  onEditPet?: (pet: Pet) => void;
  onDeletePet?: (petId: string) => void;
}

export default function MyPets({
  pets,
  onAddPet,
  onEditPet,
  onDeletePet,
}: MyPetsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'sold'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (petId: string, petName: string) => {
    if (confirm(`Are you sure you want to delete ${petName}?`)) {
      onDeletePet?.(petId);
      toast.success(`${petName} deleted successfully`);
    }
  };

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
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">My Pets</h2>
          <p className="text-neutral-600 mt-1">
            Manage your pet listings ({filteredPets.length} total)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Add New Pet
        </motion.button>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by pet name or breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive', 'sold'] as const).map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pets Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card overflow-x-auto"
      >
        {filteredPets.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Pet
                </th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Category
                </th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Price
                </th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Stock
                </th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Views
                </th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredPets.map((pet, index) => (
                  <motion.tr
                    key={pet.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -20 }}
                    className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-200">
                          <Image
                            src={pet.images[0] || '/placeholder-pet.jpg'}
                            alt={pet.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {pet.name}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {pet.breed}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                        {pet.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-neutral-900">
                      Rs {pet.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium">
                        {pet.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      👁️ {pet.views}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          pet.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : pet.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {pet.status === 'active'
                          ? '✓ Active'
                          : pet.status === 'inactive'
                          ? '⊘ Inactive'
                          : '✕ Sold'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEditPet?.(pet)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(pet.id, pet.name)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-2xl text-neutral-600 mb-2">No pets found</p>
            <p className="text-neutral-500 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by adding your first pet'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Add Your First Pet
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Add Pet Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neutral-900">
                  Add New Pet
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6 text-neutral-600" />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Pet Name"
                    className="input-field"
                  />
                  <div className="space-y-1">
                    <select className="input-field w-full">
                      <option>Select Category</option>
                      <option>Dogs</option>
                      <option>Cats</option>
                      <option>Birds</option>
                      <option>Fish</option>
                      <option>Rabbits</option>
                      <option>Hamsters</option>
                      <option>Reptiles</option>
                    </select>
                    <p className="text-[10px] text-amber-600 font-bold px-1">
                      Note: Pet feed sales are restricted to the official Petstan store.
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="Breed"
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Price (PKR)"
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Age"
                    className="input-field"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-zinc-300">
                    Health Certificate / Vaccination Record (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="input-field py-2"
                  />
                  <p className="text-xs text-neutral-500">
                    Boost trust by uploading proof of vaccination.
                  </p>
                </div>
                <textarea
                  placeholder="Pet Description"
                  rows={4}
                  className="input-field"
                />
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowAddModal(false);
                      toast.success('Pet added successfully!');
                    }}
                    className="flex-1 btn-primary"
                  >
                    Add Pet
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
