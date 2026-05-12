import User from '../models/User.js';

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(query),
  ]);
  res.json({ users, total, page, pages: Math.ceil(total / limit) });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
};

export const updateProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );
  res.json({ user });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = { ...req.body };
  if (address.isDefault) {
    user.addresses.forEach(a => a.isDefault = false);
  }
  user.addresses.push(address);
  await user.save();
  res.json({ addresses: user.addresses });
};

export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ message: 'Address not found' });
  Object.assign(address, req.body);
  if (req.body.isDefault) {
    user.addresses.forEach(a => a.isDefault = false);
    address.isDefault = true;
  }
  await user.save();
  res.json({ addresses: user.addresses });
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.json({ addresses: user.addresses });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json({ user });
};

export const toggleBanUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ user, message: user.isBanned ? 'User banned' : 'User unbanned' });
};
