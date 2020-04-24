const Joi = require('@hapi/joi')

const userValidationSchema = Joi.object(
    {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(10).max(10).required(),
        city: Joi.string().max(40).required()
    }
)

module.exports = userValidationSchema;