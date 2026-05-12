import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { calculateShipping, calculateTax, calculateDiscount } from '../utils/helpers.js';
import { sendOrderConfirmation } from '../utils/email.js';

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'stripe', couponCode, notes } = req.body;
  const productIds = items.map(i => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  if (products.length !== items.length) return res.status(400).json({ message: 'Some products not found' });
  const orderItems = items.map(item => {
    const product = products.find(p => p._id.toString() === item.product);
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    return {
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
    };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiresAt: { $gt: Date.now() } });
    if (coupon && coupon.usedCount < coupon.usageLimit) {
      discount = calculateDiscount(subtotal, coupon);
      coupon.usedCount += 1;
      await coupon.save();
    }
  }
  const total = parseFloat((subtotal + shippingFee + tax - discount).toFixed(2));
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    tax,
    discount,
    total,
    couponCode: couponCode || '',
    notes,
  });
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }
  await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [], couponCode: '', discount: 0 } });
  try {
    await sendOrderConfirmation(req.user.email, order);
  } catch (e) {}
  res.status(201).json({ order });
};

export const getOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.user.role !== 'admin') filter.user = req.user._id;
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ orders, total, page, pages: Math.ceil(total / limit) });
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json({ order });
};

export const updateOrderStatus = async (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.deliveredAt = Date.now();
  }
  if (status === 'cancelled' || status === 'refunded') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }
  }
  await order.save();
  res.json({ order });
};

export const getUserOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);
  res.json({ orders, total, page, pages: Math.ceil(total / limit) });
};

export const getOrderByInvoice = async (req, res) => {
  const order = await Order.findOne({ invoiceNumber: req.params.invoice }).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
};
