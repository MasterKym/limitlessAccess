const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		min: 6,
		max: 20,
	},

	password: {
		type: String,
		required: true,
		min: 6,
		max: 255,
	},

	city: {
		type: String,
		required: true,
		max: 40,
	},

	// Automatically generated fields
	isSuper: {
		type: Boolean,
		required: true,
		default: false,
	},

	date_created: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Admin', adminSchema);
