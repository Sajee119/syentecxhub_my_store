import mongoose from 'mongoose';

const backInStockSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

backInStockSchema.index({ email: 1, product: 1 }, { unique: true });

export default mongoose.model('BackInStock', backInStockSchema);
