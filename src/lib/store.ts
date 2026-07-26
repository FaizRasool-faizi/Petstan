import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Pet, User, Order, Seller, Review, OrderStatus, PetCategory } from '@/types';

// Auth Store (Persisted)
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'petstan-auth-store',
    }
  )
);

// Cart Store (Persisted)
interface CartStore {
  items: CartItem[];
  addToCart: (pet: Pet, quantity: number) => void;
  removeFromCart: (petId: string) => void;
  updateQuantity: (petId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (pet, quantity) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.pet.id === pet.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.pet.id === pet.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { pet, quantity }] };
        }),
      removeFromCart: (petId) =>
        set((state) => ({
          items: state.items.filter((item) => item.pet.id !== petId),
        })),
      updateQuantity: (petId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.pet.id === petId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.pet.price * item.quantity, 0);
      },
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'petstan-cart-store',
    }
  )
);

// UI Store
interface UIStore {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  locale: 'en' | 'ur';
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  closeMobileMenu: () => void;
  closeSearch: () => void;
  setLocale: (locale: 'en' | 'ur') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      locale: 'en',
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      closeSearch: () => set({ isSearchOpen: false }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'petstan-ui-store',
      partialize: (state) => ({ locale: state.locale }), // only persist locale
    }
  )
);

// Unified Data Store (Database Simulator - Persisted)
interface DataStore {
  pets: Pet[];
  sellers: Seller[];
  orders: Order[];
  reviews: Review[];
  addPet: (pet: Pet) => void;
  updatePet: (petId: string, updatedPet: Partial<Pet>) => void;
  deletePet: (petId: string) => void;
  addSeller: (seller: Seller) => void;
  updateSeller: (sellerId: string, updatedSeller: Partial<Seller>) => void;
  warnSeller: (sellerId: string) => void;
  toggleSellerSuspension: (sellerId: string, isSuspended: boolean) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addReview: (review: Review) => void;
  resetToDefault: () => void;
}

// Default Initial Mock Data
const defaultSellers: Seller[] = [
  {
    id: 's1',
    userId: 'u_seller1',
    storeName: 'Paws & Claws Store',
    storeDescription: 'Premium quality dogs and cats with health guarantee',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    bannerImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=300&fit=crop',
    rating: 4.8,
    totalSales: 156,
    totalRevenue: 2340000,
    joinedDate: new Date('2024-01-15'),
    contactInfo: {
      phone: '+92 300 1234567',
      email: 'pawsclaws@petstan.pk',
      address: 'DHA Phase 6, Karachi, Pakistan',
    },
    bankDetails: {
      accountTitle: 'Paws & Claws Store',
      accountNumber: '00123456789012',
      bankName: 'Habib Bank Limited (HBL)',
    },
    registrationNumber: 'REG-KAR-78291',
    shopTimings: '9:00 AM - 9:00 PM',
    isSuspended: false,
    warningCount: 0,
  },
  {
    id: 's2',
    userId: 'u_seller2',
    storeName: 'Pet Paradise',
    storeDescription: 'Your one-stop shop for exotic and domestic pets',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    bannerImage: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1200&h=300&fit=crop',
    rating: 4.9,
    totalSales: 203,
    totalRevenue: 3120000,
    joinedDate: new Date('2023-11-20'),
    contactInfo: {
      phone: '+92 321 9876543',
      email: 'paradise@petstan.pk',
      address: 'Gulberg III, Lahore, Pakistan',
    },
    bankDetails: {
      accountTitle: 'Pet Paradise Store',
      accountNumber: '00543210987654',
      bankName: 'Meezan Bank',
    },
    registrationNumber: 'REG-LHR-10923',
    shopTimings: '10:00 AM - 10:00 PM',
    isSuspended: false,
    warningCount: 0,
  },
  {
    id: 's3',
    userId: 'u_seller3',
    storeName: 'Exotic Birds Hub',
    storeDescription: 'Specialized in rare and exotic bird species',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller3',
    bannerImage: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=1200&h=300&fit=crop',
    rating: 4.7,
    totalSales: 89,
    totalRevenue: 1890000,
    joinedDate: new Date('2024-03-10'),
    contactInfo: {
      phone: '+92 333 5551234',
      email: 'birds@petstan.pk',
      address: 'F-10 Markaz, Islamabad, Pakistan',
    },
    bankDetails: {
      accountTitle: 'Exotic Birds Hub',
      accountNumber: '00987654321098',
      bankName: 'Bank Alfalah',
    },
    registrationNumber: 'REG-ISB-28192',
    shopTimings: '11:00 AM - 8:00 PM',
    isSuspended: false,
    warningCount: 0,
  },
  {
    id: 's_admin',
    userId: 'u_admin',
    storeName: 'Petstan Official Store',
    storeDescription: 'Official store by Petstan administration, offering premium feed and accessories.',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=petstan',
    bannerImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=300&fit=crop',
    rating: 5.0,
    totalSales: 1240,
    totalRevenue: 4500000,
    joinedDate: new Date('2023-01-01'),
    contactInfo: {
      phone: '+92 329 4642268',
      email: 'hello.faizidevx@gmail.com',
      address: 'Petstan HQ, Lahore, Pakistan',
    },
    registrationNumber: 'REG-OFFICIAL-001',
    shopTimings: '9:00 AM - 6:00 PM',
    isSuspended: false,
    warningCount: 0,
  }
];

const defaultPets: Pet[] = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    name: 'Golden Retriever Puppy',
    category: 'dogs',
    breed: 'Golden Retriever',
    price: 45000,
    stock: 3,
    description: 'Healthy and playful Golden Retriever puppy. This adorable pup is well-socialized, loves to play, and is great with children. Comes with complete vaccination records and has been raised on premium quality feed in a clean, domestic home environment.',
    images: ['https://images.unsplash.com/photo-1633722715463-d30628519d00?w=800&h=800&fit=crop'],
    age: '3 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: false,
    status: 'active',
    views: 234,
    likes: 45,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    sellerId: 's2',
    sellerName: 'Pet Paradise',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    name: 'Persian Cat',
    category: 'cats',
    breed: 'Persian',
    price: 35000,
    stock: 2,
    description: 'Beautiful white Persian cat with striking blue eyes. Calmer, very affectionate, and loves to cuddle. Double coat, premium breed pedigree, and fully litter trained. Handled with care and extremely kid-friendly.',
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop'],
    age: '4 months',
    healthStatus: 'Excellent',
    gender: 'female',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 189,
    likes: 67,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    sellerId: 's3',
    sellerName: 'Exotic Birds Hub',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller3',
    name: 'African Grey Parrot',
    category: 'birds',
    breed: 'African Grey',
    price: 85000,
    stock: 1,
    description: 'Highly intelligent talking parrot. Hand-raised from early weeks, responsive to commands, and already mimicry of basic words. Healthy plumage, active, and feeds on mix-seed & fruits.',
    images: ['https://images.unsplash.com/photo-1444464666175-1642a9f33e12?w=800&h=800&fit=crop'],
    age: '1 year',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 456,
    likes: 123,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    name: 'German Shepherd',
    category: 'dogs',
    breed: 'German Shepherd',
    price: 55000,
    stock: 2,
    description: 'High-quality German Shepherd puppy. Alert, strong bones, excellent structure, and pedigree lineage. Ideal for security guard training and family protection. De-wormed and vaccinated.',
    images: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=800&fit=crop'],
    age: '6 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 567,
    likes: 89,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    sellerId: 's2',
    sellerName: 'Pet Paradise',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    name: 'Siamese Kitten',
    category: 'cats',
    breed: 'Siamese',
    price: 28000,
    stock: 4,
    description: 'Super playful Siamese kitten. Striking blue eyes, sleek points, and highly social. Accustomed to domestic sounds and child-friendly. Fully trained on sand-litter box.',
    images: ['https://images.unsplash.com/photo-1513360371669-4a0eb3a4b3e9?w=800&h=800&fit=crop'],
    age: '2 months',
    healthStatus: 'Excellent',
    gender: 'female',
    vaccinated: true,
    trained: false,
    status: 'active',
    views: 345,
    likes: 78,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    sellerId: 's4', // Aqua World (will create dynamically if needed) or s1/s2 fallback
    sellerName: 'Pet Paradise',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller2',
    name: 'Betta Fish',
    category: 'fish',
    breed: 'Betta Splendens',
    price: 1500,
    stock: 10,
    description: 'Vibrant colored double-tail Betta fish. Very healthy, colorful active swimmer, eats standard pellets. Perfect low-maintenance table ornament.',
    images: ['https://images.unsplash.com/photo-1534080564897-61f3b9ad9a0e?w=800&h=800&fit=crop'],
    age: '6 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: false,
    trained: false,
    status: 'active',
    views: 123,
    likes: 34,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Official Pet Feeds (Admin listings)
  {
    id: 'feed1',
    sellerId: 's_admin',
    sellerName: 'Petstan Official Store',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=petstan',
    name: 'Premium Puppy Feed (High Protein)',
    category: 'feed',
    breed: 'Dog Feed',
    price: 3200,
    stock: 50,
    description: 'Official Petstan branded nutritious dry food for puppies and growing dogs. Contains essential calcium, vitamins, and high protein for maximum bone and muscle growth.',
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=800&fit=crop'],
    age: 'N/A',
    healthStatus: 'Nutritionally Certified',
    gender: 'male',
    vaccinated: false,
    trained: false,
    status: 'active',
    views: 512,
    likes: 120,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'feed2',
    sellerId: 's_admin',
    sellerName: 'Petstan Official Store',
    sellerLogo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=petstan',
    name: 'Gourmet Cat Feed (Salmon Flavor)',
    category: 'feed',
    breed: 'Cat Feed',
    price: 2800,
    stock: 45,
    description: 'Rich Salmon flavored premium cat feed by Petstan. Promotes a shiny fur coat and protects the digestive health of indoor cats. Packed with Omega-3 and Taurine.',
    images: ['https://images.unsplash.com/photo-1608454509097-e2522c547ef4?w=800&h=800&fit=crop'],
    age: 'N/A',
    healthStatus: 'Nutritionally Certified',
    gender: 'female',
    vaccinated: false,
    trained: false,
    status: 'active',
    views: 420,
    likes: 98,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  }
];

const defaultOrders: Order[] = [
  {
    id: 'ORD001',
    buyerId: 'b1',
    buyerName: 'Ahmed Khan',
    buyerEmail: 'ahmed@example.com',
    buyerPhone: '+92 300 1111111',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    items: [
      {
        id: 'item1',
        petId: '1',
        petName: 'Golden Retriever Puppy',
        petImage: 'https://images.unsplash.com/photo-1633722715463-d30628519d00?w=400&h=400&fit=crop',
        quantity: 1,
        price: 45000,
        subtotal: 45000,
      },
    ],
    totalAmount: 45000,
    status: 'pending',
    shippingAddress: {
      street: 'Flat 4B, Al-Mustafa Heights',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75300',
      country: 'Pakistan',
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderDate: new Date(),
  },
  {
    id: 'ORD002',
    buyerId: 'b2',
    buyerName: 'Fatima Ali',
    buyerEmail: 'fatima@example.com',
    buyerPhone: '+92 321 2222222',
    sellerId: 's2',
    sellerName: 'Pet Paradise',
    items: [
      {
        id: 'item2',
        petId: '2',
        petName: 'Persian Cat',
        petImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
        quantity: 1,
        price: 35000,
        subtotal: 35000,
      },
    ],
    totalAmount: 35000,
    status: 'shipped',
    shippingAddress: {
      street: 'House 55, Block D',
      city: 'Lahore',
      state: 'Punjab',
      zipCode: '54000',
      country: 'Pakistan',
    },
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveryDate: new Date(),
  }
];

const defaultReviews: Review[] = [
  {
    id: 'r_1',
    orderId: 'ORD003',
    buyerId: 'b_rev1',
    buyerName: 'Kamran Shah',
    buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kamran',
    sellerId: 's1',
    petId: '1',
    rating: 5,
    comment: 'The puppy was extremely healthy, vaccinated, and the seller was very helpful. Highly recommended!',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'r_2',
    orderId: 'ORD004',
    buyerId: 'b_rev2',
    buyerName: 'Zainab Bibi',
    buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zainab',
    sellerId: 's2',
    petId: '2',
    rating: 4,
    comment: 'Beautiful cat, litter trained as promised. Had minor delays in communication but overall great service.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  }
];

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      pets: defaultPets,
      sellers: defaultSellers,
      orders: defaultOrders,
      reviews: defaultReviews,

      addPet: (pet) => set((state) => ({ pets: [pet, ...state.pets] })),

      updatePet: (petId, updatedFields) =>
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === petId ? { ...p, ...updatedFields, updatedAt: new Date() } : p
          ),
        })),

      deletePet: (petId) =>
        set((state) => ({
          pets: state.pets.filter((p) => p.id !== petId),
        })),

      addSeller: (seller) => set((state) => ({ sellers: [...state.sellers, seller] })),

      updateSeller: (sellerId, updatedFields) =>
        set((state) => ({
          sellers: state.sellers.map((s) =>
            s.id === sellerId ? { ...s, ...updatedFields } : s
          ),
        })),

      warnSeller: (sellerId) =>
        set((state) => ({
          sellers: state.sellers.map((s) =>
            s.id === sellerId ? { ...s, warningCount: (s.warningCount || 0) + 1 } : s
          ),
        })),

      toggleSellerSuspension: (sellerId, isSuspended) =>
        set((state) => {
          const suspendedUntilStr = isSuspended
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : undefined;
          return {
            sellers: state.sellers.map((s) =>
              s.id === sellerId ? { ...s, isSuspended, suspendedUntil: suspendedUntilStr } : s
            ),
          };
        }),

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),

      addReview: (review) =>
        set((state) => {
          // Recalculate average rating of the seller
          const newReviews = [...state.reviews, review];
          const sellerReviews = newReviews.filter((r) => r.sellerId === review.sellerId);
          const averageRating =
            sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;

          return {
            reviews: newReviews,
            sellers: state.sellers.map((s) =>
              s.id === review.sellerId
                ? { ...s, rating: Number(averageRating.toFixed(1)) }
                : s
            ),
          };
        }),

      resetToDefault: () =>
        set({
          pets: defaultPets,
          sellers: defaultSellers,
          orders: defaultOrders,
          reviews: defaultReviews,
        }),
    }),
    {
      name: 'petstan-data-store',
      // Convert date strings back to Date objects on rehydration
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          if (parsed.state) {
            // Hydrate Date fields for pets
            if (parsed.state.pets) {
              parsed.state.pets = parsed.state.pets.map((p: any) => ({
                ...p,
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt),
              }));
            }
            // Hydrate Date fields for sellers
            if (parsed.state.sellers) {
              parsed.state.sellers = parsed.state.sellers.map((s: any) => ({
                ...s,
                joinedDate: new Date(s.joinedDate),
              }));
            }
            // Hydrate Date fields for orders
            if (parsed.state.orders) {
              parsed.state.orders = parsed.state.orders.map((o: any) => ({
                ...o,
                orderDate: new Date(o.orderDate),
                deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : undefined,
              }));
            }
            // Hydrate Date fields for reviews
            if (parsed.state.reviews) {
              parsed.state.reviews = parsed.state.reviews.map((r: any) => ({
                ...r,
                createdAt: new Date(r.createdAt),
              }));
            }
          }
          return parsed;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
