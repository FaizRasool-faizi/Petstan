'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useUIStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';

  const footerSections = [
    {
      title: locale === 'en' ? 'Quick Links' : 'فوری روابط',
      links: [
        { name: getTranslation('navHome', locale), href: '/' },
        { name: getTranslation('navAbout', locale), href: '/about' },
        { name: getTranslation('navTopSellers', locale), href: '/sellers' },
        { name: getTranslation('navAllPets', locale), href: '/pets' },
      ],
    },
    {
      title: locale === 'en' ? 'For Sellers' : 'فروخت کنندگان کے لیے',
      links: [
        { name: locale === 'en' ? 'Become a Seller' : 'فروش دکان رجسٹریشن', href: '/register?role=seller' },
        { name: locale === 'en' ? 'Seller Dashboard' : 'سیلر ڈیش بورڈ', href: '/seller/dashboard' },
      ],
    },
    {
      title: locale === 'en' ? 'Support & Legal' : 'سپورٹ اور قانونی',
      links: [
        { name: locale === 'en' ? 'Terms & Conditions' : 'شرائط و ضوابط', href: '#' },
        { name: locale === 'en' ? 'Privacy Policy' : 'راز داری کی پالیسی', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: FiFacebook, href: 'https://facebook.com/petstan.pk', label: 'Facebook' },
    { icon: FiYoutube, href: 'https://youtube.com/@petstan.pk', label: 'YouTube' },
    { icon: FiInstagram, href: 'https://instagram.com/petstan.pk', label: 'Instagram' },
  ];

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-primary-900 text-neutral-100 border-t border-primary-800">
      {/* Main Footer */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent ${isRtl ? 'mr-2' : ''}`}>
                Petstan
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {locale === 'en'
                ? "Pakistan's first pet selling marketplace. Find healthy pets from verified sellers or list your pets on your own customized store page."
                : "پاکستان کی پہلی پالتو جانوروں کی مارکیٹ پلیس۔ تصدیق شدہ دکانداروں سے صحت مند پالتو جانور تلاش کریں یا اپنے پالتو جانور فروخت کے لیے پیش کریں۔"}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span dir="ltr">+92 329 4642268</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>hello.faizidevx@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiMapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>{locale === 'en' ? 'Pakistan' : 'پاکستان'}</span>
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-lg font-bold text-white relative pb-2 group">
                {section.title}
                <span className={`absolute bottom-0 w-8 h-0.5 bg-primary-600 transition-all ${isRtl ? 'right-0' : 'left-0'}`} />
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-primary-500 hover:translate-x-1 transition-all text-sm inline-block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Official Branding Box Removed to save space */}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-neutral-400 text-sm text-center md:text-left">
            &copy; {currentYear} Petstan. {locale === 'en' ? 'All rights reserved.' : 'جملہ حقوق محفوظ ہیں۔'}
            <span className="block sm:inline sm:ml-2">
              {locale === 'en' ? 'Made with 🐾 in Pakistan.' : 'پاکستان میں 🐾 کے ساتھ تیار کیا گیا۔'}
            </span>
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">{locale === 'en' ? 'We Accept:' : 'ہم قبول کرتے ہیں:'}</span>
            <div className="flex gap-2">
              {['💵 COD', '🏦 Transfer'].map((txt, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 bg-primary-800 border border-primary-700 rounded text-xs font-bold text-primary-100"
                >
                  {txt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Scroll Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-40"
      >
        ↑
      </motion.button>
    </footer>
  );
}
