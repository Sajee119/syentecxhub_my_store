import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getProductReviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: req.params.productId, isApproved: true }),
  ]);
  res.json({ reviews, total, page, pages: Math.ceil(total / limit) });
};

export const createReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const existingReview = await Review.findOne({ user: req.user._id, product: req.params.productId });
  if (existingReview) return res.status(400).json({ message: 'You already reviewed this product' });
  const review = await Review.create({
    user: req.user._id,
    product: req.params.productId,
    rating,
    title,
    comment,
  });
  const reviews = await Review.find({ product: req.params.productId, isApproved: true });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.params.productId, {
    rating: parseFloat(avgRating.toFixed(1)),
    numReviews: reviews.length,
  });
  res.status(201).json({ review });
};

export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const productId = review.product;
  await Review.findByIdAndDelete(req.params.id);
  const reviews = await Review.find({ product: productId, isApproved: true });
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  await Product.findByIdAndUpdate(productId, {
    rating: parseFloat(avgRating.toFixed(1)),
    numReviews: reviews.length,
  });
  res.json({ message: 'Review deleted' });
};
