'use client';

import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiTrendingUp,
  FiEye,
  FiStar,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatPKR } from '@/utils/format';

interface DashboardOverviewProps {
  stats: {
    totalRevenue: number;
    totalSales: number;
    pendingOrders: number;
    totalPets: number;
    totalViews: number;
    averageRating: number;
  };
  monthlyData: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  topPets: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function DashboardOverview({
  stats,
  monthlyData,
  topPets,
}: DashboardOverviewProps) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPKR(stats.totalRevenue),
      icon: FiDollarSign,
      color: 'bg-gradient-to-br from-green-500 to-green-700',
      change: '+12.5%',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: FiShoppingBag,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      change: '+8.2%',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FiPackage,
      color: 'bg-gradient-to-br from-orange-500 to-orange-700',
      change: '-3.1%',
    },
    {
      title: 'Total Pets',
      value: stats.totalPets,
      icon: FiTrendingUp,
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
      change: '+5.0%',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: FiEye,
      color: 'bg-gradient-to-br from-pink-500 to-pink-700',
      change: '+15.3%',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: FiStar,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      change: '+0.2',
    },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-900 mb-2">
                    {stat.value}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      stat.change.startsWith('+')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change} from last month
                  </span>
                </div>
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-neutral-900 mb-6">
            Monthly Sales & Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Selling Pets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-neutral-900 mb-6">
            Top Selling Pets
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-neutral-900 mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              action: 'New order received',
              pet: 'Golden Retriever Puppy',
              time: '2 hours ago',
              status: 'pending',
            },
            {
              action: 'Pet sold',
              pet: 'Persian Cat',
              time: '5 hours ago',
              status: 'completed',
            },
            {
              action: 'New review',
              pet: 'German Shepherd',
              time: '1 day ago',
              status: 'review',
            },
            {
              action: 'Order delivered',
              pet: 'Siamese Kitten',
              time: '2 days ago',
              status: 'completed',
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === 'pending'
                      ? 'bg-orange-500'
                      : activity.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div>
                  <p className="font-medium text-neutral-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-neutral-600">{activity.pet}</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
