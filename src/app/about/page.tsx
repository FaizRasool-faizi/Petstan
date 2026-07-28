'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiAward,
  FiHeart,
  FiArrowRight,
} from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';

export default function AboutPage() {
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

  const sellerSteps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up as a seller on Petstan with your basic information',
      icon: FiUsers,
      details: [
        'Visit petstan.pk/register',
        'Click "Seller" option',
        'Fill in your name, email, phone, and address',
        'Create a strong password',
        'Accept terms and conditions',
      ],
    },
    {
      number: '02',
      title: 'Setup Store',
      description: 'Create your unique pet store with branding and information',
      icon: FiAward,
      details: [
        'Add store name and description',
        'Upload store logo (200x200px)',
        'Upload store banner (1200x300px)',
        'Add contact information',
        'Verify your email address',
      ],
    },
    {
      number: '03',
      title: 'Add Pets',
      description: 'List your pets with detailed information and high-quality photos',
      icon: FiHeart,
      details: [
        'Go to "My Pets" section',
        'Click "Add New Pet"',
        'Fill pet details (name, breed, age, price)',
        'Upload 3-5 high-quality images',
        'Set stock quantity',
        'Publish listing',
      ],
    },
    {
      number: '04',
      title: 'Manage Orders',
      description: 'Track and manage customer orders from your dashboard',
      icon: FiTrendingUp,
      details: [
        'View all incoming orders',
        'Update order status',
        'Communicate with buyers',
        'Generate invoices',
        'Track payments',
      ],
    },
    {
      number: '05',
      title: 'Grow Business',
      description: 'Use analytics to improve sales and customer satisfaction',
      icon: FiTrendingUp,
      details: [
        'View monthly sales reports',
        'Check top-selling pets',
        'Monitor customer reviews',
        'Analyze traffic and views',
        'Optimize listings',
      ],
    },
    {
      number: '06',
      title: 'Get Paid',
      description: 'Receive payments securely to your bank account',
      icon: FiCheckCircle,
      details: [
        'Add bank details in settings',
        'Payments processed weekly',
        'Transparent fee structure',
        'Secure transactions',
        'Multiple payment methods',
      ],
    },
  ];

  const features = [
    {
      icon: FiShield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with industry-leading security',
    },
    {
      icon: FiUsers,
      title: 'Large Customer Base',
      description: 'Access to thousands of pet lovers across Pakistan',
    },
    {
      icon: FiTrendingUp,
      title: 'Growth Tools',
      description: 'Analytics and insights to help grow your pet business',
    },
    {
      icon: FiAward,
      title: 'Quality Assurance',
      description: 'We ensure all sellers meet high standards of pet care',
    },
  ];

  const stats = [
    { number: '100+', label: 'Active Sellers' },
    { number: '500+', label: 'Pets Listed' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Monthly Visitors' },
  ];

  return (
    <main className="min-h-screen bg-neutral-50">
      <Toaster position="top-right" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-50 to-neutral-50">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                About Petstan
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight"
            >
              Connecting Pet Lovers with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Trusted Sellers
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-neutral-600 mb-8"
            >
              Petstan is Pakistan&apos;s leading pet marketplace, bringing together passionate pet sellers and loving pet owners in one secure platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register?role=seller">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  Become a Seller
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/pets">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline text-lg px-8 py-4"
                >
                  Browse Pets
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-neutral-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl font-bold text-neutral-900">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                At Petstan, we believe every pet deserves a loving home and every pet lover deserves access to healthy, well-cared-for animals. Our mission is to create a trusted marketplace that connects passionate pet sellers with caring pet owners across Pakistan.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                We&apos;re committed to ensuring the highest standards of pet welfare, transparent transactions, and exceptional customer service.
              </p>

              <div className="space-y-3 pt-4">
                {[
                  'Trusted by thousands of pet lovers',
                  'Secure and transparent transactions',
                  'Quality assurance for all pets',
                  'Professional seller support',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <FiCheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/pets/golden-retriever.png"
                alt="Happy pets"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Petstan?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We provide everything you need to succeed as a pet seller
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="card text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Seller Registration Guide */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              How to Become a Seller
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              6 simple steps to start your pet selling journey on Petstan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {sellerSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left - Number & Icon */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                      <div className="text-6xl font-bold text-primary-100">
                        {step.number}
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Middle - Title & Description */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="text-neutral-600 text-lg">
                        {step.description}
                      </p>
                    </div>

                    {/* Right - Details List */}
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: detailIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < sellerSteps.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-primary-300 to-transparent mt-8" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-primary-100">
              Join thousands of successful pet sellers on Petstan and grow your business today.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register?role=seller">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 font-bold py-4 px-8 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started Now
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Contact Support
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {[
              {
                q: 'What are the requirements to become a seller?',
                a: 'You need to be at least 18 years old, have a valid email address, phone number, and bank account for receiving payments.',
              },
              {
                q: 'How much does it cost to list pets?',
                a: 'Listing is free! We only charge a small commission (5-10%) on successful sales.',
              },
              {
                q: 'How do I get paid?',
                a: 'Payments are processed weekly to your registered bank account. We support all major Pakistani banks.',
              },
              {
                q: 'What if a customer has issues with their purchase?',
                a: 'We have a comprehensive dispute resolution system. Our support team helps mediate between buyers and sellers.',
              },
              {
                q: 'Can I sell multiple types of pets?',
                a: 'Yes! You can sell dogs, cats, birds, fish, rabbits, hamsters, reptiles, and other pets.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card space-y-3"
              >
                <h3 className="text-lg font-bold text-neutral-900">{faq.q}</h3>
                <p className="text-neutral-600">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
