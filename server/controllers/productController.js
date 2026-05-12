import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { generateSlug, paginate } from '../utils/helpers.js';
import cloudinaryConfig from '../config/cloudinary.js';

export const getProducts = async (req, res) => {
  const { page, limit, skip } = paginate(req.query.page, req.query.limit);
  const { category, search, minPrice, maxPrice, sortBy, rating, featured, tags } = req.query;
  const filter = { isActive: true };
  if (category) {
    if (mongoose.isValidObjectId(category)) {
      filter.category = category;
    } else {
      const categoryDoc = await Category.findOne({ slug: category }).select('_id');
      if (!categoryDoc) {
        return res.json({ products: [], total: 0, page, pages: 0 });
      }
      filter.category = categoryDoc._id;
    }
  }
  if (featured) filter.isFeatured = true;
  if (rating) filter.rating = { $gte: parseFloat(rating) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  if (tags) filter.tags = { $in: tags.split(',') };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }
  let sort = '-createdAt';
  if (sortBy === 'price_asc') sort = 'price';
  if (sortBy === 'price_desc') sort = '-price';
  if (sortBy === 'rating') sort = '-rating';
  if (sortBy === 'newest') sort = '-createdAt';
  if (sortBy === 'name') sort = 'name';
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.json({ products, total, page, pages: Math.ceil(total / limit) });
};

export const getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort('-rating')
    .limit(8);
  res.json({ products });
};

export const getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const products = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
  }).limit(4).populate('category', 'name slug');
  res.json({ products });
};

export const createProduct = async (req, res) => {
  let slug = generateSlug(req.body.name);
  const existingSlug = await Product.findOne({ slug });
  if (existingSlug) slug = `${slug}-${Date.now()}`;
  const productData = { ...req.body, slug };
  if (req.files?.length) {
    productData.images = req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: req.body.name }));
  }
  const product = await Product.create(productData);
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (req.body.name && req.body.name !== product.name) {
    req.body.slug = generateSlug(req.body.name);
  }
  if (req.files?.length) {
    req.body.images = [...product.images, ...req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: req.body.name }))];
  }
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ product: updated });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

export const uploadProductImages = async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
  const images = req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: '' }));
  res.json({ images });
};

export const getLowStockProducts = async (req, res) => {
  const products = await Product.find({ stock: { $lte: 10 }, isActive: true })
    .populate('category', 'name')
    .sort('stock')
    .limit(20);
  res.json({ products });
};
