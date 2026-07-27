'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pad = (num: number) => num.toString().padStart(2, '0');

const FlipUnit = ({ value, label }: { value: number, label: string }) => (
  <div 
    className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center min-w-[80px] sm:min-w-[90px] border border-white/30 shadow-xl overflow-hidden relative"
    style={{ perspective: '1000px' }}
  >
    <div className="relative h-12 w-full flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="block text-4xl sm:text-5xl font-black absolute drop-shadow-md text-white"
          style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
        >
          {pad(value)}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-xs font-bold uppercase tracking-widest opacity-90 mt-2 block relative z-10 text-white">
      {label}
    </span>
  </div>
);

export default function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 45,
    seconds: 12
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev; // Timer ended
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex gap-3 sm:gap-4 z-20 relative">
        {['Hours', 'Mins', 'Secs'].map(label => (
          <div key={label} className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center min-w-[80px] sm:min-w-[90px] border border-white/30 shadow-xl">
             <span className="block text-4xl sm:text-5xl font-black opacity-0">00</span>
             <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-2 block">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4 z-20 relative">
      <FlipUnit value={timeLeft.hours} label="Hours" />
      <FlipUnit value={timeLeft.minutes} label="Mins" />
      <FlipUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
