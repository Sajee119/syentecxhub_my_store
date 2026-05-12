import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

export const getDashboardStats = async (req, res) => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
    monthlyOrders,
    monthlyRevenue,
    lastMonthRevenue,
    recentOrders,
    lowStockProducts,
    ordersByStatus,
    categoryCount,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments({ createdAt: { $gte: thisMonth } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: thisMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.find().populate('user', 'name email').sort('-createdAt').limit(10),
    Product.find({ stock: { $lte: 10 }, isActive: true }).sort('stock').limit(5),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Category.countDocuments({ isActive: true }),
  ]);
  res.json({
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalProducts,
      monthlyOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      revenueChange: lastMonthRevenue[0]?.total ? ((monthlyRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100 : 0,
      categoryCount,
    },
    recentOrders,
    lowStockProducts,
    ordersByStatus,
  });
};

export const getRevenueData = async (req, res) => {
  const months = parseInt(req.query.months) || 12;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  const revenueData = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      revenue: { $sum: '$total' },
      orders: { $sum: 1 },
    }},
    { $sort: { _id: 1 } },
  ]);
  const ordersData = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 },
      revenue: { $sum: '$total' },
    }},
    { $sort: { _id: 1 } },
  ]);
  res.json({ revenueData, ordersData });
};

export const getTopProducts = async (req, res) => {
  const products = await Product.find({ isActive: true }).sort('-sold').limit(10).select('name price sold stock images');
  res.json({ products });
};

export const getRecentUsers = async (req, res) => {
  const users = await User.find().sort('-createdAt').limit(10).select('name email role createdAt isBanned');
  res.json({ users });
};
