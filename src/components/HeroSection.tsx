'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useDataStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';
import { FiArrowRight, FiShoppingBag, FiUsers } from 'react-icons/fi';

const row1Images = [
  '/pets/golden-retriever.png',
  '/pets/persian-cat.png',
  '/pets/african-grey.png',
  '/pets/german-shepherd.png',
  '/pets/siamese-kitten.png',
  '/pets/betta-fish.png',
];

const row2Images = [
  '/pets/betta-fish.png',
  '/pets/siamese-kitten.png',
  '/pets/german-shepherd.png',
  '/pets/african-grey.png',
  '/pets/persian-cat.png',
  '/pets/golden-retriever.png',
];

export default function HeroSection() {
  const { locale } = useUIStore();
  const { pets, sellers } = useDataStore();
  const isRtl = locale === 'ur';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="relative w-full overflow-hidden bg-primary-900 flex items-center justify-center pt-24 pb-12">
      {/* Auto-scrolling Background Image Marquees */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center space-y-4 opacity-40 select-none pointer-events-none scale-105">
        {/* Row 1 - Left to Right */}
        <div className="w-[200%] flex overflow-hidden whitespace-nowrap">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
            className="flex space-x-4 pr-4"
          >
            {[...row1Images, ...row1Images].map((img, idx) => (
              <div key={idx} className="relative w-[280px] h-[180px] rounded-2xl overflow-hidden flex-shrink-0 mx-2">
                <Image src={img} alt="pet" fill className="object-cover" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="w-[200%] flex overflow-hidden whitespace-nowrap">
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
            className="flex space-x-4 pr-4"
          >
            {[...row2Images, ...row2Images].map((img, idx) => (
              <div key={idx} className="relative w-[280px] h-[180px] rounded-2xl overflow-hidden flex-shrink-0 mx-2">
                <Image src={img} alt="pet" fill className="object-cover" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modern Gradient Overlays for High Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900 z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800/50 via-transparent to-primary-800/50 z-0" />
      <div className="absolute inset-0 bg-primary-900/20 z-0" />

      {/* Content Container */}
      <div className="relative z-10 w-full container-custom text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Welcome Tag */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900/40 border border-primary-500/30 text-primary-400 rounded-full text-sm font-bold tracking-wide uppercase">
              🐾 {getTranslation('heroWelcome', locale)}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-[1.15]"
          >
            {getTranslation('heroTitle', locale)}{' '}
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-400 bg-clip-text text-transparent drop-shadow-sm">
              {getTranslation('heroTitleHighlight', locale)}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-neutral-300 mb-6 max-w-2xl font-medium leading-relaxed"
          >
            {getTranslation('heroSubtitle', locale)}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-10"
          >
            <Link href="/pets">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary-900/30 transition-all flex items-center justify-center gap-2"
              >
                {getTranslation('heroBrowseBtn', locale)}
                <FiArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </motion.button>
            </Link>
            <Link href="/register?role=seller">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto border-2 border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-500 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-5 h-5 text-secondary-400" />
                {getTranslation('heroSellersBtn', locale)}
              </motion.button>
            </Link>
          </motion.div>

          {/* Platform Performance Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-12 w-full max-w-2xl border-t border-neutral-800 pt-6"
          >
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                100+
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-bold uppercase tracking-wide">
                {getTranslation('heroStatSellers', locale)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                500+
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-bold uppercase tracking-wide">
                {getTranslation('heroStatPets', locale)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                10K+
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-bold uppercase tracking-wide">
                {getTranslation('heroStatCustomers', locale)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
