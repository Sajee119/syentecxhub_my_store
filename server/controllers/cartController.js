import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { calculateDiscount } from '../utils/helpers.js';

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json({ cart });
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const existingIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }
  await cart.save();
  cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
  res.json({ cart });
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (quantity < 1) {
    cart.items.pull(req.params.itemId);
  } else {
    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    item.quantity = quantity;
  }
  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
  res.json({ cart: updatedCart });
};

export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items.pull(req.params.itemId);
  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
  res.json({ cart: updatedCart });
};

export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.couponCode = '';
    cart.discount = 0;
    await cart.save();
  }
  res.json({ cart });
};

export const applyCoupon = async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiresAt: { $gt: Date.now() } });
  if (!coupon) return res.status(400).json({ message: 'Invalid or expired coupon' });
  if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'price');
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal, coupon);
  cart.couponCode = code.toUpperCase();
  cart.discount = discount;
  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
  res.json({ cart: updatedCart });
};

export const removeCoupon = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.couponCode = '';
    cart.discount = 0;
    await cart.save();
  }
  const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
  res.json({ cart: updatedCart });
};
