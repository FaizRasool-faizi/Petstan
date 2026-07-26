import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  petId: mongoose.Types.ObjectId;
  petName: string;
  petImage: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerId: mongoose.Types.ObjectId;
  sellerName: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderDate: Date;
  deliveryDate?: Date;
  notes?: string;
}

const OrderItemSchema = new Schema({
  petId: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  petName: { type: String, required: true },
  petImage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    sellerName: { type: String, required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
