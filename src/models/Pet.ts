import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPet extends Document {
  sellerId: mongoose.Types.ObjectId;
  sellerName: string;
  sellerLogo?: string;
  name: string;
  category: string;
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
  isVerified: boolean;
  healthCertificate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema: Schema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    sellerName: { type: String, required: true },
    sellerLogo: { type: String },
    name: { type: String, required: true },
    category: { type: String, required: true },
    breed: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 1 },
    description: { type: String, required: true },
    images: [{ type: String }],
    age: { type: String, required: true },
    healthStatus: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    vaccinated: { type: Boolean, default: false },
    trained: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    healthCertificate: { type: String },
  },
  { timestamps: true }
);

export const Pet: Model<IPet> = mongoose.models.Pet || mongoose.model<IPet>('Pet', PetSchema);
