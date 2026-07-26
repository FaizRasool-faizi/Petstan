'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useUIStore } from '@/lib/store';
import { getTranslation } from '@/utils/translations';

// Mock stories data
const mockStories = [
  {
    id: '1',
    user: 'Paws & Claws',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=1200&fit=crop',
    title: 'Meet Max! Our newest Golden 🐶',
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: 'Pet Paradise',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=1200&fit=crop',
    title: 'This Persian beauty just got adopted ❤️',
    timestamp: '4h ago'
  },
  {
    id: '3',
    user: 'Exotic Birds',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller3',
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800&h=1200&fit=crop',
    title: 'New Parrots arriving tomorrow! 🦜',
    timestamp: '6h ago'
  },
  {
    id: '4',
    user: 'Aqua World',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller4',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&h=1200&fit=crop',
    title: 'Rare Betta Fish collection 🐠',
    timestamp: '8h ago'
  },
  {
    id: '5',
    user: 'Happy Paws',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller5',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=1200&fit=crop',
    title: 'Puppy training day! 🐾',
    timestamp: '12h ago'
  }
];

export default function PetStories() {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const { locale } = useUIStore();
  const isRtl = locale === 'ur';

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStory !== null && activeStory < mockStories.length - 1) {
      setActiveStory(activeStory + 1);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStory !== null && activeStory > 0) {
      setActiveStory(activeStory - 1);
    }
  };

  return (
    <div className="py-6 bg-white overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        <h3 className="text-lg font-extrabold text-neutral-900 mb-4 flex items-center gap-2">
          📸 {locale === 'en' ? 'Pet Stories' : 'پالتو جانوروں کی کہانیاں'}
        </h3>
        
        {/* Story Bubbles */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {mockStories.map((story, index) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveStory(index)}
              className="flex flex-col items-center gap-2 cursor-pointer snap-start flex-shrink-0"
            >
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-secondary-500">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src={story.avatar}
                    alt={story.user}
                    fill
                    className="object-cover bg-neutral-100"
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-neutral-700 w-20 text-center truncate">
                {story.user}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setActiveStory(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              onClick={() => setActiveStory(null)}
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Story Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md h-[80vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar Header */}
              <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex gap-1 mb-4">
                  {mockStories.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                      {idx === activeStory && (
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "linear" }}
                          onAnimationComplete={() => {
                            if (activeStory < mockStories.length - 1) setActiveStory(activeStory + 1);
                            else setActiveStory(null);
                          }}
                          className="h-full bg-white"
                        />
                      )}
                      {idx < activeStory && <div className="h-full bg-white" />}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/50 relative">
                    <Image src={mockStories[activeStory].avatar} alt="avatar" fill className="object-cover bg-neutral-100" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{mockStories[activeStory].user}</p>
                    <p className="text-white/70 text-xs">{mockStories[activeStory].timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Story Image */}
              <div className="relative w-full h-full">
                <Image
                  src={mockStories[activeStory].image}
                  alt="Story"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Story Text Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-lg leading-snug drop-shadow-md">
                  {mockStories[activeStory].title}
                </p>
                <div className="mt-4 flex gap-2">
                  <input type="text" placeholder={locale === 'en' ? "Reply..." : "جواب دیں..."} className="flex-1 bg-white/20 border border-white/30 rounded-full px-4 py-2 text-white placeholder-white/70 text-sm outline-none focus:bg-white/30 transition-colors" />
                </div>
              </div>

              {/* Navigation Areas */}
              <div 
                className="absolute top-0 left-0 w-1/3 h-full cursor-pointer flex items-center justify-start px-2 opacity-0 hover:opacity-100 transition-opacity"
                onClick={handlePrev}
              >
                <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                  <FiChevronLeft className="w-6 h-6" />
                </div>
              </div>
              <div 
                className="absolute top-0 right-0 w-1/3 h-full cursor-pointer flex items-center justify-end px-2 opacity-0 hover:opacity-100 transition-opacity"
                onClick={handleNext}
              >
                <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                  <FiChevronRight className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
