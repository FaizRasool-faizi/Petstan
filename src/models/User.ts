import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for OAuth or later
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
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
  suspendedUntil?: Date;
  warningCount?: number;
  isVerified: boolean;
  kyc: {
    cnicNumber?: string;
    cnicFront?: string;
    cnicBack?: string;
    status: 'unverified' | 'pending' | 'approved' | 'rejected';
  };
}

const SellerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true },
    storeDescription: { type: String, required: true },
    logo: { type: String },
    bannerImage: { type: String },
    rating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    bankDetails: {
      accountTitle: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
    },
    registrationNumber: { type: String },
    shopTimings: { type: String },
    isSuspended: { type: Boolean, default: false },
    suspendedUntil: { type: Date },
    warningCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    kyc: {
      cnicNumber: { type: String },
      cnicFront: { type: String },
      cnicBack: { type: String },
      status: { type: String, enum: ['unverified', 'pending', 'approved', 'rejected'], default: 'unverified' },
    },
  },
  { timestamps: true }
);

export const Seller: Model<ISeller> = mongoose.models.Seller || mongoose.model<ISeller>('Seller', SellerSchema);
