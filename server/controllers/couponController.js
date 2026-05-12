import Coupon from '../models/Coupon.js';

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ coupons });
};

export const getCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json({ coupon });
};

export const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ coupon });
};

export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json({ coupon });
};

export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json({ message: 'Coupon deleted' });
};

export const validateCoupon = async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiresAt: { $gt: Date.now() } });
  if (!coupon) return res.status(400).json({ message: 'Invalid or expired coupon', valid: false });
  if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached', valid: false });
  if (subtotal < coupon.minOrderValue) return res.status(400).json({ message: `Minimum order value $${coupon.minOrderValue} required`, valid: false });
  const discount = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
  const finalDiscount = coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
  res.json({ valid: true, coupon, discount: parseFloat(finalDiscount.toFixed(2)) });
};
