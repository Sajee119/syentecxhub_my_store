import FAQ from '../models/FAQ.js';

export const getFAQs = async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const faqs = await FAQ.find(filter).sort('order');
  res.json({ faqs });
};

export const getAllFAQs = async (req, res) => {
  const faqs = await FAQ.find().sort('order');
  res.json({ faqs });
};

export const createFAQ = async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ faq });
};

export const updateFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!faq) return res.status(404).json({ message: 'FAQ not found' });
  res.json({ faq });
};

export const deleteFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) return res.status(404).json({ message: 'FAQ not found' });
  res.json({ message: 'FAQ deleted' });
};
