import Joi from 'joi';

const colorSchema = Joi.object({
  color: Joi.string().required().messages({
    "string.base": "Color must be a string",
    "string.empty": "Color cannot be empty",
  }),
  discountPercentage: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Discount percentage must be a number",
    "number.min": "Discount percentage minimum value is 0",
    "number.max": "Discount percentage maximum value is 100",
  }),
  image: Joi.any().allow('').optional().messages({
    "string.base": "Image must be a string",
  }),
});

const productSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must have at least 3 characters",
    "string.max": "Title must have at most 255 characters",
  }),
  description: Joi.string().allow('').optional().messages(),
  category: Joi.string().required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category cannot be empty",
  }),
  images: Joi.array().items(Joi.any()).optional().messages({
    "array.base": "Images must be an array",
  }),
  colors: Joi.array().items(colorSchema).min(1).required().messages({
    "array.base": "Colors must be an array",
    "array.includesRequiredUnknowns": "Each color entry must be valid",
    "array.min": "At least one color must be provided",
  }),
});

export default productSchema;
