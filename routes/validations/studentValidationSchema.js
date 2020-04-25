const Joi = require('@hapi/joi')


const photoObject = Joi.object().keys({
    data: Joi.binary(),
    mimeType: Joi.string()
})

const studentValidationSchema = Joi.object(
    {
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().min(3).max(20).required(),
        studyNumber: Joi.string().min(0).max(12),
        school: Joi.string().min(3).max(20).required(),
        phone: Joi.string().min(10).max(10).required(),
        phoneOperator: Joi.string().min(3).max(10).required(),

        city: Joi.string().max(40).required(),
        // cardFront: Joi.binary(), //TODO maybe add base64 encoding
        // cardBack: Joi.binary(), //TODO maybe add base64 encoding
        cardPhotos: Joi.array().items(photoObject).required()
    
    }
)


module.exports = studentValidationSchema;