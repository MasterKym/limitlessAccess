const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/Student');

const connectToDb = () => {
	console.log(process.env.remoteDB)
	const dbURL =
		process.env.NODE_ENV === 'dev' ? process.env.localDB : process.env.remoteDB;
	console.log('Db URL:', dbURL);

	mongoose
		.connect(
			dbURL,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			(err) => {
				if (err) {
					console.log(err);
					throw err;
				}
			}
		)
		.then(() => {
			console.log('Connection Established');
		})
		.catch(() => {
			console.log('Error while connecting to DB');
			// console.log(`Waiting ${isDev ? 2 : 15} seconds before re attempting..`)
			// const timer = setTimeout(connectToDb, isDev ? 1000 : 15000)
		});
};
// Set mongoose options
// mongoose.set('debug', process.env.mongooseEnv == 'true');
mongoose.set('debug', (collectionName, method, query, doc) => {
	if (process.env.mongooseEnv != 'true') {
		return;
	}
	if (collectionName === 'students' && method === 'insertOne') {
		// console.log(`${collectionName}.${method}`, doc);
		console.log('here');
	}
	console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});
mongoose.set('useFindAndModify', false);
// Connect to Database
connectToDb();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Set Up CORS SETTINGs
app.use('', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Expose-Headers','login-token')

	next();
});

const userRouter = require('./routes/userRouter');
app.use('', userRouter);
const adminRouter = require('./routes/adminRouter');
app.use('', adminRouter);
app.get('/', (req, res) => {
	res.send('Home Here');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('App listening..', PORT);
});
