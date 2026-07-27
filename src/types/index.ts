export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string;
  logo?: string;
  bannerImage?: string;
  rating: number;
  totalSales: number;
  totalRevenue: number;
  joinedDate: Date;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  bankDetails?: {
    accountTitle: string;
    accountNumber: string;
    bankName: string;
  };
  registrationNumber?: string;
  shopTimings?: string;
  isSuspended?: boolean;
  suspendedUntil?: string;
  warningCount?: number;
  isVerified?: boolean;
}

export interface Pet {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLogo?: string;
  name: string;
  category: PetCategory;
  breed: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  age: string;
  healthStatus: string;
  gender: 'male' | 'female';
  vaccinated: boolean;
  trained: boolean;
  status: 'active' | 'inactive' | 'sold';
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  isVerified?: boolean;
  healthCertificate?: string;
}

export type PetCategory =
  | 'dogs'
  | 'cats'
  | 'birds'
  | 'fish'
  | 'rabbits'
  | 'hamsters'
  | 'reptiles'
  | 'goats'
  | 'horses'
  | 'feed'
  | 'other';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderDate: Date;
  deliveryDate?: Date;
  notes?: string;
}

export interface OrderItem {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Review {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  sellerId: string;
  petId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

export interface CartItem {
  pet: Pet;
  quantity: number;
}

export interface SellerStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalPets: number;
  activePets: number;
  totalViews: number;
  averageRating: number;
  monthlyData: MonthlyStats[];
  topSellingPets: TopPet[];
  recentOrders: Order[];
}

export interface MonthlyStats {
  month: string;
  sales: number;
  revenue: number;
  orders: number;
}

export interface TopPet {
  pet: Pet;
  salesCount: number;
  revenue: number;
}

export interface SearchFilters {
  category?: PetCategory;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female';
  vaccinated?: boolean;
  trained?: boolean;
  city?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular';
  searchQuery?: string;
}
