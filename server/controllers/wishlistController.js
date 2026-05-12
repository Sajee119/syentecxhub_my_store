import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price images rating stock slug');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }
  res.json({ wishlist });
};

export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  const exists = wishlist.products.some(p => p.toString() === productId);
  if (exists) {
    wishlist.products.pull(productId);
  } else {
    wishlist.products.push(productId);
  }
  await wishlist.save();
  const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price images rating stock slug');
  res.json({ wishlist: updatedWishlist, isWishlisted: !exists });
};

export const clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (wishlist) {
    wishlist.products = [];
    await wishlist.save();
  }
  res.json({ wishlist });
};
