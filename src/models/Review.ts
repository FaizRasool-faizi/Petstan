import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  sellerId: mongoose.Types.ObjectId;
  petId?: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    petId: { type: Schema.Types.ObjectId, ref: 'Pet' }, // Optional: If the review is about a specific pet
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
