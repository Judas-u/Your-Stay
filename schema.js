const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required().min(1),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().required()
        }).required()

    }).required()
});
