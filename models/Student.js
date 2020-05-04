// Mongoose and mongoose settings
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
	// Personal info fields
	firstName: {
		type: String,
		required: true,
		min: 3,
		max: 20,
	},

	lastName: {
		type: String,
		required: true,
		min: 3,
		max: 20,
	},

	studyNumber: {
		type: String,
		required: true,
		max: 12,
	},

	school: {
		type: String,
		required: true,
		max: 20,
	},
	phone: {
		type: String,
		required: true,
		min: 10,
		max: 10,
	},

	phoneOperator: {
		type: String,
		required: true,
		max: 20,
	},

	city: {
		type: String,
		required: true,
		max: 40,
	},

	// student Card fields
	cardPhotos: [
		{
			path: {
				type: String,
				required: true,
			},
			mimeType: {
				type: String,
				required: true,
			},
		},
	],

	//
	operations: [
		{
			value: {
				type: Number,
				required: true,
			},
			time: {
				type: Date,
				default: Date.now,
				required: true,
			},
			// The admin who did the operation
			by: {
				id: {
					type: String,
					required: true,
				},
				username: {
					type: String,
					required: true,
				},
			},
		},
	],

	// Automatically generated fields
	verified: {
		type: Boolean,
		default: false,
		required: true,
	},

	date_created: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const index = { firstName: 'text', lastName: 'text' };

userSchema.index(index);

module.exports = mongoose.model('Student', userSchema);
