'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

// Mock accessories data
const accessories = [
  {
    id: 'acc1',
    name: 'Premium Pet Food (5kg)',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
    rating: 4.8
  },
  {
    id: 'acc2',
    name: 'Soft Pet Bed - Medium',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop',
    rating: 4.9
  },
  {
    id: 'acc3',
    name: 'Adjustable Leash & Collar',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1601002766867-b5bf82069b2b?w=400&h=400&fit=crop',
    rating: 4.7
  },
  {
    id: 'acc4',
    name: 'Interactive Toy Set',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=400&fit=crop',
    rating: 4.6
  }
];

export default function CrossSell({ petCategory }: { petCategory: string }) {
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const { addToCart } = useCartStore();

  const handleAdd = (item: any) => {
    // In a real app, we'd add the actual accessory object to the cart.
    // For now, we simulate it.
    const mockAccessoryProduct = {
      id: item.id,
      name: item.name,
      price: item.price,
      images: [item.image],
      sellerId: 'system',
      sellerName: 'Petstan Official',
      category: 'feed',
      stock: 10,
      status: 'active' as const
    };
    
    addToCart(mockAccessoryProduct as any, 1);
    toast.success(`${item.name} added to cart!`);
    
    setAddedItems(prev => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
  };

  return (
    <div className="bg-neutral-50 rounded-3xl p-6 md:p-8 border border-neutral-200 mt-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-neutral-900">Frequently Bought Together</h3>
        <p className="text-neutral-500 mt-1">Get everything your new friend needs before checkout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accessories.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col h-full"
          >
            <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 bg-neutral-100">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 leading-tight mb-1">{item.name}</h4>
                <div className="flex items-center text-xs text-secondary-500 mb-2">
                  <span>★</span> <span className="text-neutral-500 ml-1">{item.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-neutral-100">
                <span className="font-extrabold text-primary-600">Rs {item.price.toLocaleString()}</span>
                
                <button
                  onClick={() => handleAdd(item)}
                  disabled={addedItems.has(item.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    addedItems.has(item.id) 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-neutral-100 hover:bg-primary-600 hover:text-white text-neutral-600'
                  }`}
                >
                  {addedItems.has(item.id) ? <FiCheck /> : <FiPlus />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
