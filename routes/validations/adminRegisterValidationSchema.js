const Joi = require('@hapi/joi')

const adminRegisterValidationSchema = Joi.object(
    {
        username: Joi.string().min(6).max(20).required(),

        password: Joi.string().min(6).max(20).required(),

        city: Joi.string().max(40).required()
    }
)

module.exports = adminRegisterValidationSchema;