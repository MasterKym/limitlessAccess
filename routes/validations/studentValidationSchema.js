const Joi = require('@hapi/joi')

const studentValidationSchema = Joi.object(
    {
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().min(3).max(20).required(),
        studyNumber: Joi.string().min(0).max(12),
        school: Joi.string().min(3).max(20).required(),
        phone: Joi.string().min(10).max(10).required(),
        city: Joi.string().max(40).required()
    }
)

module.exports = studentValidationSchema;