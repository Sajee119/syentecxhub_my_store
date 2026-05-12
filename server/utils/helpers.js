import slugify from 'slugify';

export const generateSlug = (text) => {
  return slugify(text, { lower: true, strict: true });
};

export const calculateShipping = (subtotal) => {
  if (subtotal >= 100) return 0;
  return 9.99;
};

export const calculateTax = (subtotal) => {
  return parseFloat((subtotal * 0.08).toFixed(2));
};

export const calculateDiscount = (subtotal, coupon) => {
  if (!coupon) return 0;
  if (subtotal < coupon.minOrderValue) return 0;
  let discount = coupon.type === 'percentage'
    ? (subtotal * coupon.value) / 100
    : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return parseFloat(discount.toFixed(2));
};

export const paginate = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  return { skip: (p - 1) * l, limit: l, page: p };
};
