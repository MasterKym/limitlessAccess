const Joi = require('@hapi/joi')

const adminLoginValidationSchema = Joi.object(
    {
        username: Joi.string().min(6).max(20).required(),

        password: Joi.string().min(6).max(20).required()
    }
)

module.exports = adminLoginValidationSchema;