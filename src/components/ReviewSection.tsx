'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiUser, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';

interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  sellerId: string;
  petId?: string;
  title?: string;
}

export default function ReviewSection({ sellerId, petId, title = 'Reviews & Ratings' }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [sellerId, petId]);

  const fetchReviews = async () => {
    try {
      let url = `/api/reviews?sellerId=${sellerId}`;
      if (petId) url += `&petId=${petId}`;
      const res = await axios.get(url);
      setReviews(res.data);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { sellerId, petId, rating, comment };
      const res = await axios.post('/api/reviews', payload);
      setReviews([res.data, ...reviews]);
      setComment('');
      setRating(5);
      setShowForm(false);
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-neutral-100 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
            <FiMessageSquare className="text-primary-600" />
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-secondary-500 text-secondary-500'
                      : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-neutral-800 text-lg">{averageRating}</span>
            <span className="text-neutral-500">({reviews.length} reviews)</span>
          </div>
        </div>

        {user?.role === 'buyer' && !showForm && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="btn-outline border-neutral-300 text-neutral-700 font-semibold"
          >
            Write a Review
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden"
          >
            <h3 className="font-bold text-neutral-900 mb-4">Leave your rating</h3>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <FiStar
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-secondary-500 text-secondary-500' : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full p-4 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all mb-4"
              required
            />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Post Review'}
              </motion.button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline border-neutral-300"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-1/4" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-4 hover:bg-neutral-50 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUser className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-neutral-900">{review.buyerName}</h4>
                  <span className="text-neutral-400 text-sm">•</span>
                  <span className="text-neutral-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-secondary-500 text-secondary-500' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-neutral-700">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FiMessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No reviews yet. Be the first to leave one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
