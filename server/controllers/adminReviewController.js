import Review from '../models/Review.js';

export const getAllReviews = async (req, res) => {
  const { page = 1, limit = 20, isApproved } = req.query;
  const filter = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments(filter),
  ]);
  res.json({ reviews, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};

export const toggleApproval = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  review.isApproved = !review.isApproved;
  await review.save();
  res.json({ review });
};

export const adminDeleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ message: 'Review deleted' });
};
