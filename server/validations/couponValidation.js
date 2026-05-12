import Joi from 'joi';

export const couponSchema = Joi.object({
  code: Joi.string().uppercase().min(3).max(20).required(),
  type: Joi.string().valid('percentage', 'fixed').required(),
  value: Joi.number().min(1).required(),
  minOrderValue: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(1).allow(null).optional(),
  usageLimit: Joi.number().integer().min(1).default(1),
  expiresAt: Joi.date().greater('now').required(),
});
