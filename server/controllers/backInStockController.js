import BackInStock from '../models/BackInStock.js';
import Product from '../models/Product.js';

export const subscribe = async (req, res) => {
  const { email, productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const existing = await BackInStock.findOne({ email, product: productId });
  if (existing) return res.status(400).json({ message: 'Already subscribed for this product' });
  await BackInStock.create({ email, product: productId });
  res.status(201).json({ message: 'We will notify you when back in stock' });
};

export const getRequests = async (req, res) => {
  const requests = await BackInStock.find({ notified: false }).populate('product', 'name images price').sort('-createdAt');
  res.json({ requests });
};

export const markNotified = async (req, res) => {
  const request = await BackInStock.findByIdAndUpdate(req.params.id, { notified: true }, { new: true });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json({ request });
};

export const deleteRequest = async (req, res) => {
  const request = await BackInStock.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json({ message: 'Request deleted' });
};
