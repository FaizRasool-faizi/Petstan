'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiGlobe } from 'react-icons/fi';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, locale, setLocale } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRtl = locale === 'ur';

  const navLinks = [
    { name: getTranslation('navHome', locale), href: '/' },
    { name: getTranslation('navAbout', locale), href: '/about' },
    { name: getTranslation('navTopSellers', locale), href: '/sellers' },
    { name: getTranslation('navAllPets', locale), href: '/pets' },
  ];

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'ur' : 'en';
    setLocale(nextLocale);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'seller') return '/seller/dashboard';
    return '/';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-100'
          : 'bg-white/80 backdrop-blur-sm border-b border-neutral-100/50'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent ${isRtl ? 'mr-2' : ''}`}>
                Petstan
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-neutral-700 hover:text-primary-600 font-semibold transition-colors relative group mx-2 ${
                  isRtl ? 'text-lg font-medium' : ''
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 gap-2">
            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
              title={locale === 'en' ? 'Urdu' : 'English'}
            >
              <FiGlobe className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-bold font-sans">
                {locale === 'en' ? 'اردو' : 'EN'}
              </span>
            </motion.button>

            {/* Cart */}
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <FiShoppingCart className="w-5 h-5 text-neutral-700" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                {user?.role === 'buyer' && (
                  <Link href="/orders" className="text-sm font-semibold text-neutral-700 hover:text-primary-600 hidden md:block mr-2">
                    {locale === 'en' ? 'My Orders' : 'میرے آرڈرز'}
                  </Link>
                )}
                <Link href={getDashboardLink()}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 hidden md:inline max-w-[80px] truncate">
                      {user?.role === 'admin' ? getTranslation('adminTitle', locale).split(' ')[0] : user?.name}
                    </span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className={`text-sm text-neutral-600 hover:text-red-600 font-semibold px-2 py-1 transition-colors ${isRtl ? 'mr-2' : ''}`}
                >
                  {getTranslation('navLogout', locale)}
                </motion.button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-neutral-700 hover:text-primary-600 font-semibold px-3 py-1.5 rounded-lg"
                  >
                    {getTranslation('navLogin', locale)}
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary py-2 px-4 shadow-sm hover:shadow-md"
                  >
                    {getTranslation('navSignUp', locale)}
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-neutral-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-neutral-700" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-neutral-200"
          >
            <div className="container-custom py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {!isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="flex gap-2 p-4 border-t border-neutral-100 mt-2"
                >
                  <Link href="/login" onClick={closeMobileMenu} className="flex-1">
                    <button className="w-full btn-outline py-2">{getTranslation('navLogin', locale)}</button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="flex-1">
                    <button className="w-full btn-primary py-2">{getTranslation('navSignUp', locale)}</button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="p-4 border-t border-neutral-100 mt-2 space-y-2"
                >
                  <Link href={getDashboardLink()} onClick={closeMobileMenu} className="block">
                    <button className="w-full btn-primary py-2">{getTranslation('navDashboard', locale)}</button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                      window.location.href = '/';
                    }}
                    className="w-full text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors font-semibold"
                  >
                    {getTranslation('navLogout', locale)}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
