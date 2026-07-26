'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    phone: '',
    address: ''
  });

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  // If they are already a seller, redirect them
  if (session?.user?.role === 'seller') {
     router.push('/seller/dashboard');
     return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storeName || !formData.storeDescription || !formData.phone || !formData.address) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/complete-profile', formData);
      
      // Update NextAuth session to reflect the new seller role
      await update({ role: 'seller' });
      
      toast.success('Seller profile completed!');
      router.push('/seller/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary-600">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Complete Seller Profile</h1>
          <p className="text-neutral-500 mt-2">Just a few more details to set up your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Store Name</label>
            <input type="text" className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:border-secondary-500 focus:outline-none" value={formData.storeName} onChange={(e) => setFormData({...formData, storeName: e.target.value})} placeholder="Paws & Claws" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Store Description</label>
            <textarea className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:border-secondary-500 focus:outline-none" rows={3} value={formData.storeDescription} onChange={(e) => setFormData({...formData, storeDescription: e.target.value})} placeholder="Tell us about your store..." required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Phone Number</label>
            <input type="tel" className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:border-secondary-500 focus:outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+92 300 1234567" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Store Address</label>
            <input type="text" className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:border-secondary-500 focus:outline-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Karachi, Pakistan" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full btn-secondary py-3 flex items-center justify-center gap-2 font-bold disabled:opacity-50">
            {isLoading ? 'Saving...' : <>Open Store <FiArrowRight /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
