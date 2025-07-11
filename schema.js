const Joi = require('joi');

// Listing Schema
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().min(1).trim().required(),
    country: Joi.string().trim().required(),
    image: Joi.object({
      url: Joi.string().uri().required()
    }).required()
  }).required()
});

// Review Schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().required()
  }).required()
});
