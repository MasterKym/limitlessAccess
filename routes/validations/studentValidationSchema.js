const Joi = require('@hapi/joi');

const photoObject = Joi.object().keys({
	path: Joi.string(),
	mimeType: Joi.string(),
});

const studentValidationSchema = Joi.object({
	firstName: Joi.string().min(3).max(20).required().messages({
		'string.min': 'Prénom doit avoir plus de 3 lettres',
		'string.max': 'Prénom doit avoir moins de 20 lettres',
		'any.empty': 'Vous devez entrer votre Prénom',
	}),

	lastName: Joi.string().min(3).max(20).required().messages({
		'string.min': 'Nom doit avoir plus de 3 lettres',
		'string.max': 'Nom doit avoir moins de 20 lettres',
		'any.empty': 'Vous devez entrer votre Nom',
	}),

	studyNumber: Joi.string().min(0).max(12).required().messages({
		'string.min': 'Code apogée doit avoir plus de 0 chiffres',
		'string.max': 'Code apogée doit avoir moins de 12 chiffres.',
		'any.empty': 'Vous devez entrer votre code apogée',
	}),

	school: Joi.string().min(3).max(20).required().messages({
		'string.min': 'Etablissement doit avoir plus de 3 lettres',
		'string.max': 'Etablissement doit avoir moins de 20 lettres',
		'any.empty': 'Vous devez entrer votre  établissement',
	}),

	phone: Joi.string().min(10).max(10).required().messages({
		'string.min': 'Le numéro de téléphone doit avoir exactement 10 chiffres.',
		'string.max': 'Le numéro de téléphone doit avoir exactement 10 chiffres.',
		'any.empty': 'Vous devez entrer votre numéro de téléphone',
	}),
	phoneOperator: Joi.string().min(3).max(10).required(),

	city: Joi.string().max(40).required().messages({
		'string.min': 'Ville doit avoir plus de 0 lettres',
		'string.max': 'Ville doit avoir moins de 40 lettres',
		'any.empty': 'Vous devez entrer votre  ville',
	}),

	// cardFront: Joi.binary(), //TODO maybe add base64 encoding
	// cardBack: Joi.binary(), //TODO maybe add base64 encoding
	cardPhotos: Joi.array().items(photoObject).min(2).max(2).required().messages({
		'string.min':
			"Vous devez entrer exactement deux photos de votre carte d'étudiant",
		'string.max':
			"Vous devez entrer exactement deux photos de votre carte d'étudiant",
		'any.empty': "Vous devez entrer vos photos de carte d'étudiant",
	}),
	// .error(() => {
	// 	return {
	// 		message: 'Voud devez',
	// 	};
	// })
});

module.exports = studentValidationSchema;
