import Newsletter from '../models/Newsletter.js';

export const getSubscribers = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [subscribers, total] = await Promise.all([
    Newsletter.find().sort('-createdAt').skip(skip).limit(parseInt(limit)),
    Newsletter.countDocuments(),
  ]);
  res.json({ subscribers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};

export const deleteSubscriber = async (req, res) => {
  const sub = await Newsletter.findByIdAndDelete(req.params.id);
  if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
  res.json({ message: 'Subscriber removed' });
};
