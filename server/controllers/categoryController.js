import Category from '../models/Category.js';
import { generateSlug } from '../utils/helpers.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('order');
  res.json({ categories });
};

export const getAllCategories = async (req, res) => {
  const categories = await Category.find().sort('order');
  res.json({ categories });
};

export const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ category });
};

export const createCategory = async (req, res) => {
  const slug = generateSlug(req.body.name);
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
};
