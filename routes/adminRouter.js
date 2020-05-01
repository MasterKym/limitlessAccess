const express = require('express');
const verifyLogin = require('./verifyLogin');
const isSuper = require('./isSuper');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
// const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

// Import Joi validations
const adminRegisterValidationSchema = require('./validations/adminRegisterValidationSchema');
const adminLoginValidationSchema = require('./validations/adminLoginValidationSchema');
// Importing Mongo Models
const Admin = require('../models/Admin');
const Student = require('../models/Student');

const adminRouter = express.Router();

// Routes related to Admin only
adminRouter.post('/admin/register', verifyLogin, isSuper, async (req, res) => {
	try {
		const { error, value } = adminRegisterValidationSchema.validate({
			username: req.body.username,
			password: req.body.password,
			city: req.body.city,
		});
		if (error) {
			return res.status(400).json({
				message: error.details[0].message,
			});
		}
	} catch (error) {
		console.log('Validation Error');
		console.log(error);
	}

	try {
		const adminExists = await Admin.findOne({
			username: req.body.username,
		});

		if (adminExists) {
			return res.status(409).json({
				message: 'The username you entered already exist',
			});
		}
	} catch (error) {
		console.log('Error while checking if user already exists');
	}

	try {
		const salt = await bcrypt.genSalt(15);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const admin = new Admin({
			username: req.body.username,
			password: hashedPassword,
			city: req.body.city,
		});
		console.log('reached admin creation in DB');
		const savedAdmin = await admin.save();

		return res.status(200).json({
			username: savedAdmin.username,
			isSuper: savedAdmin.isSuper,
			city: savedAdmin.city,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
});

adminRouter.post('/admin/login', async (req, res) => {
	try {
		const { error, value } = adminLoginValidationSchema.validate({
			username: req.body.username,
			password: req.body.password,
		});
		if (error) {
			return res.status(400).json({
				message: error.details[0].message,
			});
		}
	} catch (error) {
		console.log('Validation Error');
		console.log(error);
	}

	try {
		const attemptAdmin = await Admin.findOne({
			username: req.body.username,
		});

		if (!attemptAdmin) {
			return res.status(404).json({
				message: 'Admin Not Found',
			});
		}
		// console.log(attemptAdmin)
		// console.log(req.body.password)
		// console.log(attemptAdmin.password)

		const validPass = await bcrypt.compare(
			req.body.password,
			attemptAdmin.password
		);

		if (!validPass) {
			return res.status(401).json({
				message: 'Wrong Password',
			});
		}

		const loginToken = jsonwebtoken.sign(
			{
				_id: attemptAdmin._id,
				username: attemptAdmin.username,
				isSuper: attemptAdmin.isSuper,
			},
			process.env.SECRET_JWT_TOKEN,
			{ expiresIn: '6h' }
		);

		res.cookie('login-token', loginToken, {
			httpOnly: true,
			secure: process.env.HTTPS === 'true',
			expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
		});
		//		res.set('Authorization', 'Bearer ' + loginToken);

		return res.status(200).json({
			message: 'Successful Login',
			admin: {
				_id: attemptAdmin._id,
				username: attemptAdmin.username,
				isSuper: attemptAdmin.isSuper,
			},
		});
	} catch (error) {
		console.log(error);
		console.log('Error while checking if Admin is registered');
	}

	// try {

	// } catch(error){
	//     console.log(error)
	// }
});

// Routes related to admin getting/modifying users
adminRouter.get('/admin/students', verifyLogin, async (req, res) => {
	console.log(res.locals.user);
	console.log(req.query);

	const limitQueryInt = parseInt(req.query.limit);
	const limit =
		typeof limitQueryInt === 'number' && limitQueryInt < 51 && limitQueryInt > 9
			? limitQueryInt
			: 10;

	const skipQueryInt = parseInt(req.query.skip);
	const skip =
		typeof skipQueryInt === 'number' && skipQueryInt > 0 ? skipQueryInt : 0;

	console.log(limit);
	console.log(skip);

	const verifiedQuery = req.query.verified;

	let query = {};
	if (verifiedQuery && verifiedQuery === 'true') {
		query.verified = true;
	} else if (verifiedQuery && verifiedQuery === 'false') {
		query.verified = false;
	}

	try {
		const students = await Student.find(query)
			.sort({ 'operations.time': 1 })
			.skip(skip)
			.limit(limit)
			.select('-cardPhotos');
		// .select('verified');

		if (students) {
			return res.status(200).json({
				count: students.length,
				students: students,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

adminRouter.get('/admin/students/:id', verifyLogin, async (req, res) => {
	try {
		const idQuery = req.params.id;

		if (!idQuery || typeof idQuery != 'string') {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Please provide a student id.',
			});
		}
		if (idQuery.length != 24) {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Invalid id length.',
			});
		}
		const id = mongoose.Types.ObjectId(idQuery);
		const student = await Student.findOne({ _id: id }, (err, doc, res) => {
			if (err) {
				console.log(err);
				console.log(doc);
			}
		});
		if (!student) {
			return res.status(404).json({
				message: 'Incorrect id. No student with this id',
			});
		}

		return res.status(200).json({
			student,
		});
	} catch (error) {
		console.log(error);
	}
});

adminRouter.get('/admin/userphoto', verifyLogin, async (req, res) => {
	try {
		// console.log(req.query.path);
		const pathQuery = req.query.path;

		if (!pathQuery || typeof pathQuery != 'string') {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Please provide a student id.',
			});
		}

		// console.log(photoPath);
		if (!fs.existsSync(pathQuery)) {
			// This looks to be starting from the root of the project.
			// That is limitlessAccess/
			return res.status(404).json({
				error: 'Photo not found',
				message: 'Please provide a valid photo path.',
			});
		}

		return res.status(200).sendFile(pathQuery, { root: process.cwd() });
	} catch (error) {
		console.log(error);
		res.status(500).end();
		throw error;
	}
});

adminRouter.post('/admin/students/verify', verifyLogin, async (req, res) => {
	// console.log(req.query);
	// console.log(idQuery.length);

	try {
		const idQuery = req.query.id;

		if (!idQuery || typeof idQuery != 'string') {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Please provide a student id.',
			});
		}
		if (idQuery.length != 24) {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Invalid id length.',
			});
		}
		const id = mongoose.Types.ObjectId(idQuery);
		const student = await Student.findOne({ _id: id }, (err, doc, res) => {
			if (err) {
				console.log(err);
				console.log(doc);
			}
		});

		if (!student) {
			return res.status(404).json({
				message: 'Incorrect id. No student with this id',
			});
		}

		if (student.verified === true) {
			return res.status(400).json({
				error: 'Already verified',
				message: 'This student has already been verified',
			});
		}

		// If not already verified, set verified to true and save
		student.verified = true;
		const savedStudent = await student.save();

		return res.status(200).json({
			message: 'Successful update',
			newStudent: savedStudent,
		});
	} catch (err) {
		console.log(err);
	}
});

adminRouter.post('/admin/students/operate', verifyLogin, async (req, res) => {
	// console.log(req.query);
	// console.log(idQuery.length);
	// console.log(typeof idQuery);

	try {
		const idQuery = req.query.id;
		if (!idQuery || typeof idQuery != 'string') {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Please provide a student id.',
			});
		}
		if (idQuery.length != 24) {
			return res.status(400).json({
				error: 'Invalid id',
				message: 'Invalid id length.',
			});
		}
		const id = mongoose.Types.ObjectId(idQuery);

		const valueQuery = req.query.value;

		if (!valueQuery || typeof valueQuery != 'string') {
			return res.status(400).json({
				error: 'Invalid operation value',
				message: 'Please provide an operation value.',
			});
		}
		const value = parseInt(valueQuery);
		if (value != 5 && value != 10 && value != 20) {
			return res.status(400).json({
				error: 'Invalid operation value',
				message: 'Please provide an operation value, either 5, 10 or 20',
			});
		}
		const student = await Student.findOne({ _id: id }, (err, doc, res) => {
			if (err) {
				console.log(err);
				console.log(doc);
			}
		});
		if (!student) {
			return res.status(404).json({
				message: 'Incorrect id. No student with this id',
			});
		}
		const by = {
			username: res.locals.user.username,
			id: res.locals.user._id,
		};
		// push a new operation object and save
		student.operations.push({ value, by });
		student.latestOperation = { value, by };
		const savedStudent = await student.save();

		return res.status(200).json({
			message: 'Successful update',
			newStudent: savedStudent,
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = adminRouter;
