'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiCamera, FiSave, FiX, FiCheckCircle, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { Seller } from '@/types';
import toast from 'react-hot-toast';

interface StoreSettingsProps {
  seller: Seller;
  onSave?: (updatedSeller: Seller) => void;
}

export default function StoreSettings({ seller, onSave }: StoreSettingsProps) {
  const [formData, setFormData] = useState({
    storeName: seller.storeName,
    storeDescription: seller.storeDescription,
    phone: seller.contactInfo.phone,
    email: seller.contactInfo.email,
    address: seller.contactInfo.address,
    accountTitle: seller.bankDetails?.accountTitle || '',
    accountNumber: seller.bankDetails?.accountNumber || '',
    bankName: seller.bankDetails?.bankName || '',
    registrationNumber: seller.registrationNumber || '',
    shopTimings: seller.shopTimings || '',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(seller.logo || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    seller.bannerImage || null
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSeller: Partial<Seller> = {
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        logo: logoPreview || seller.logo,
        bannerImage: bannerPreview || seller.bannerImage,
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        },
        bankDetails: {
          accountTitle: formData.accountTitle,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
        },
        registrationNumber: formData.registrationNumber,
        shopTimings: formData.shopTimings,
      };

      const res = await axios.put('/api/sellers/me', updatedSeller);
      onSave?.(res.data);
      toast.success('Store settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-neutral-900">Store Settings</h2>
        <p className="text-neutral-600 mt-1">
          Manage your store information and branding
        </p>
      </motion.div>

      {/* Store Branding */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h3 className="text-xl font-bold text-neutral-900">Store Branding</h3>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Store Logo
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-200 border-2 border-dashed border-neutral-300">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Store Logo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <FiUpload className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="btn-outline inline-flex items-center gap-2 cursor-pointer">
                <FiUpload className="w-5 h-5" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-neutral-600 mt-2">
                Recommended size: 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-3">
            Store Banner
          </label>
          <div className="space-y-3">
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-200 border-2 border-dashed border-neutral-300">
              {bannerPreview ? (
                <Image
                  src={bannerPreview}
                  alt="Store Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <FiUpload className="w-8 h-8" />
                </div>
              )}
            </div>
            <label className="btn-outline inline-flex items-center gap-2 cursor-pointer">
              <FiUpload className="w-5 h-5" />
              Upload Banner
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-neutral-600">
              Recommended size: 1200x300px
            </p>
          </div>
        </div>
      </motion.div>

      {/* Store Information */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h3 className="text-xl font-bold text-neutral-900">Store Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Store Description
            </label>
            <textarea
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="Tell customers about your store..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Business Registration No. (Optional)
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. NTN or SECP No."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Shop Timings
              </label>
              <input
                type="text"
                name="shopTimings"
                value={formData.shopTimings}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 10 AM - 10 PM"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h3 className="text-xl font-bold text-neutral-900">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>
      </motion.div>

      {/* Bank Details */}
      <motion.div variants={itemVariants} className="card space-y-6">
        <h3 className="text-xl font-bold text-neutral-900">Bank Details</h3>
        <p className="text-sm text-neutral-600">
          Your bank details are encrypted and secure
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Account Title
            </label>
            <input
              type="text"
              name="accountTitle"
              value={formData.accountTitle}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex gap-4 justify-end sticky bottom-0 bg-white p-4 rounded-lg shadow-lg"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <FiSave className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
