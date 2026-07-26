'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import SellerSidebar from '@/components/SellerSidebar';
import DashboardOverview from '@/components/DashboardOverview';
import MyPets from '@/components/MyPets';
import OrdersManagement from '@/components/OrdersManagement';
import StoreSettings from '@/components/StoreSettings';
import SellerKYC from '@/components/SellerKYC';
import { Pet, Seller, Order, OrderStatus } from '@/types';
import { Toaster } from 'react-hot-toast';

// Mock Data
const mockSeller: Seller = {
  id: 's1',
  userId: 'u1',
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
    address: 'Karachi, Pakistan',
  },
  bankDetails: {
    accountTitle: 'Paws & Claws Store',
    accountNumber: '1234567890',
    bankName: 'HBL',
  },
};

const mockPets: Pet[] = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    name: 'Golden Retriever Puppy',
    category: 'dogs',
    breed: 'Golden Retriever',
    price: 45000,
    stock: 3,
    description: 'Healthy and playful Golden Retriever puppy',
    images: ['https://images.unsplash.com/photo-1633722715463-d30628519d00?w=400&h=400&fit=crop'],
    age: '3 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: false,
    status: 'active',
    views: 234,
    likes: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    name: 'German Shepherd',
    category: 'dogs',
    breed: 'German Shepherd',
    price: 55000,
    stock: 2,
    description: 'Well-trained guard dog, excellent temperament',
    images: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop'],
    age: '6 months',
    healthStatus: 'Excellent',
    gender: 'male',
    vaccinated: true,
    trained: true,
    status: 'active',
    views: 567,
    likes: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    name: 'Labrador Retriever',
    category: 'dogs',
    breed: 'Labrador',
    price: 40000,
    stock: 1,
    description: 'Friendly and energetic Labrador puppy',
    images: ['https://images.unsplash.com/photo-1633722715463-d30628519d00?w=400&h=400&fit=crop'],
    age: '2 months',
    healthStatus: 'Excellent',
    gender: 'female',
    vaccinated: true,
    trained: false,
    status: 'sold',
    views: 345,
    likes: 67,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockOrders: Order[] = [
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
      street: '123 Main Street',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75000',
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
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    items: [
      {
        id: 'item2',
        petId: '2',
        petName: 'German Shepherd',
        petImage: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
        quantity: 1,
        price: 55000,
        subtotal: 55000,
      },
    ],
    totalAmount: 55000,
    status: 'shipped',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Lahore',
      state: 'Punjab',
      zipCode: '54000',
      country: 'Pakistan',
    },
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveryDate: new Date(),
  },
  {
    id: 'ORD003',
    buyerId: 'b3',
    buyerName: 'Hassan Raza',
    buyerEmail: 'hassan@example.com',
    buyerPhone: '+92 333 3333333',
    sellerId: 's1',
    sellerName: 'Paws & Claws Store',
    items: [
      {
        id: 'item3',
        petId: '1',
        petName: 'Golden Retriever Puppy',
        petImage: 'https://images.unsplash.com/photo-1633722715463-d30628519d00?w=400&h=400&fit=crop',
        quantity: 1,
        price: 45000,
        subtotal: 45000,
      },
    ],
    totalAmount: 45000,
    status: 'delivered',
    shippingAddress: {
      street: '789 Pine Road',
      city: 'Islamabad',
      state: 'ICT',
      zipCode: '44000',
      country: 'Pakistan',
    },
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const monthlyData = [
  { month: 'Jan', sales: 12, revenue: 540000 },
  { month: 'Feb', sales: 19, revenue: 855000 },
  { month: 'Mar', sales: 15, revenue: 675000 },
  { month: 'Apr', sales: 25, revenue: 1125000 },
  { month: 'May', sales: 22, revenue: 990000 },
  { month: 'Jun', sales: 30, revenue: 1350000 },
];

const topPets = [
  { name: 'Golden Retriever', sales: 45, revenue: 2025000 },
  { name: 'German Shepherd', sales: 38, revenue: 2090000 },
  { name: 'Labrador', sales: 28, revenue: 1120000 },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const stats = {
    totalRevenue: orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0),
    totalSales: orders.filter(o => o.status === 'delivered').length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    totalPets: mockPets.length,
    totalViews: mockPets.reduce((sum, pet) => sum + pet.views, 0),
    averageRating: mockSeller.rating,
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <Toaster position="top-right" />
      <Navbar />

      <div className="flex pt-20">
        {/* Sidebar */}
        <SellerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && (
              <DashboardOverview
                stats={stats}
                monthlyData={monthlyData}
                topPets={topPets}
              />
            )}

            {activeTab === 'pets' && (
              <MyPets
                pets={mockPets}
                onAddPet={() => console.log('Add pet')}
                onEditPet={(pet) => console.log('Edit pet:', pet)}
                onDeletePet={(petId) => console.log('Delete pet:', petId)}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersManagement
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="card">
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                  Analytics
                </h2>
                <p className="text-neutral-600">
                  Advanced analytics coming soon...
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <StoreSettings
                seller={mockSeller}
                onSave={(updatedSeller) =>
                  console.log('Save settings:', updatedSeller)
                }
              />
            )}

            {activeTab === 'kyc' && (
              <SellerKYC />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
