import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(),
  originalPrice: Joi.number().min(0).allow(null).optional(),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri(),
    alt: Joi.string().allow(''),
  })).optional(),
  stock: Joi.number().integer().min(0).required(),
  isFeatured: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  brand: Joi.string().allow('').optional(),
  specifications: Joi.array().items(Joi.object({
    key: Joi.string(),
    value: Joi.string(),
  })).optional(),
});
