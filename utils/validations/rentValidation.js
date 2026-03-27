import Joi from "joi";

export const rentSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),
  subCategory: Joi.string().allow("").optional(),
  mainImg: Joi.object().empty(null).required().messages({
    "any.required": "Image is required",
    "object.base": "Invalid image format",
  }),
  price: Joi.number().empty("").required().messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
  }),
  priceType: Joi.string().required().messages({
    "string.empty": "Price type is required",
  }),
  rentFrequency: Joi.string().required().messages({
    "string.empty": "Rent frequency is required",
  }),
  adType: Joi.string().required().messages({
    "string.empty": "Ad type is required",
  }),
  isShipping: Joi.boolean().required().messages({
    "boolean.empty": "Is shipping is required",
  }),
  addressLine1: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
  addressLine2: Joi.allow("").optional(),
  city: Joi.string().required().messages({
    "string.empty": "City is required",
  }),
  zipCode: Joi.number().empty("").required().messages({
    "any.required": "Postal code is required",
    "number.base": "Postal code must be a number",
  }),
  latitude: Joi.number().optional().messages({
    "number.base": "Latitude must be a number",
  }),
  longitude: Joi.number().optional().messages({
    "number.base": "Longitude must be a number",
  }),
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Please enter a valid phone number with 10 to 15 digits",
    }),
  hideContact: Joi.boolean().required().messages({
    "boolean.empty": "Hide contact number is required",
  }),
});
