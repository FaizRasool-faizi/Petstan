'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiShield, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function SellerKYC() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'unverified' | 'pending' | 'approved' | 'rejected'>('unverified');
  const [formData, setFormData] = useState({
    cnicNumber: '',
    cnicFront: '',
    cnicBack: '',
  });

  useEffect(() => {
    // Fetch initial KYC status
    axios.get('/api/sellers/me').then((res) => {
      if (res.data?.kyc) {
        setFormData({
          cnicNumber: res.data.kyc.cnicNumber || '',
          cnicFront: res.data.kyc.cnicFront || '',
          cnicBack: res.data.kyc.cnicBack || '',
        });
        setStatus(res.data.kyc.status);
      }
    }).catch((err) => console.error(err));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cnicFront' | 'cnicBack') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await axios.post('/api/upload', data);
      setFormData((prev) => ({ ...prev, [field]: res.data.url }));
      toast.success(`${field === 'cnicFront' ? 'Front' : 'Back'} image uploaded`);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cnicNumber || !formData.cnicFront || !formData.cnicBack) {
      toast.error('Please complete all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/sellers/kyc', formData);
      setStatus('pending');
      toast.success('KYC application submitted successfully');
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = {
    unverified: { icon: FiShield, color: 'text-neutral-500', bg: 'bg-neutral-100 dark:bg-zinc-800', text: 'Unverified' },
    pending: { icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'Pending Approval' },
    approved: { icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'Verified' },
    rejected: { icon: FiXCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'Rejected' },
  };

  const currentStatus = statusConfig[status];
  const Icon = currentStatus.icon;

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-zinc-50 flex items-center gap-2">
            <FiShield className="text-primary-600" />
            KYC Verification
          </h2>
          <p className="text-neutral-500 dark:text-zinc-400 mt-1">
            Verify your identity to build trust and get the Verified Seller Badge.
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStatus.bg} ${currentStatus.color}`}>
          <Icon className="w-5 h-5" />
          <span className="font-semibold">{currentStatus.text}</span>
        </div>
      </div>

      {status === 'approved' ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-zinc-50">You are Verified!</h3>
          <p className="text-neutral-500 dark:text-zinc-400 max-w-md mx-auto mt-2">
            Your store now displays the Verified Badge. Buyers trust verified sellers up to 3x more.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-zinc-300 mb-2">
              CNIC Number (13 digits)
            </label>
            <input
              type="text"
              placeholder="e.g. 42101-1234567-1"
              value={formData.cnicNumber}
              onChange={(e) => setFormData({ ...formData, cnicNumber: e.target.value })}
              className="input"
              disabled={status === 'pending'}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-zinc-300 mb-2">
                CNIC Front Image
              </label>
              <div className="border-2 border-dashed border-neutral-300 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-primary-500 transition-colors relative">
                {formData.cnicFront ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.cnicFront} alt="CNIC Front" className="mx-auto max-h-40 rounded" />
                ) : (
                  <div className="flex flex-col items-center">
                    <FiUpload className="w-8 h-8 text-neutral-400 mb-2" />
                    <span className="text-sm text-neutral-500">Upload Front Side</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cnicFront')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={status === 'pending'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-zinc-300 mb-2">
                CNIC Back Image
              </label>
              <div className="border-2 border-dashed border-neutral-300 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-primary-500 transition-colors relative">
                {formData.cnicBack ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.cnicBack} alt="CNIC Back" className="mx-auto max-h-40 rounded" />
                ) : (
                  <div className="flex flex-col items-center">
                    <FiUpload className="w-8 h-8 text-neutral-400 mb-2" />
                    <span className="text-sm text-neutral-500">Upload Back Side</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cnicBack')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={status === 'pending'}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || status === 'pending'}
              className="btn btn-primary w-full md:w-auto px-8 py-3 rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : status === 'pending' ? 'Under Review' : 'Submit for Verification'}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}
