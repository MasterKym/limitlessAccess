const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads');
	},

	filename: (req, file, cb) => {
		// console.log("From multer")
		// console.log(file)

		cb(
			null,
			req.body.firstName + req.body.lastName + new Date().toISOString()
			// +
			// '.' +
			// file.mimetype.split('/')[1]
		);
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Unsupported file format'), false);
	}
};

const limits = {
	fileSize: 5 * 1024 * 1024,
};

const upload = multer({
	storage: storage,
	limits: limits,
	fileFilter: fileFilter,
}).array('studentCardPhotos', 2);
// .any();

function multerMiddleware(req, res, next) {
	// console.log(req.body.studentCardPhotos);
	upload(req, res, (error) => {
		if (error && error instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			// console.log('Multer error', error);
			return res.status(400).json({
				message: error.message,
				field: error.field,
			});
		}
		if (error) {
			// An unknown error occurred when uploading.
			console.log('Unknown error', error);
			return res.status(500).json({
				// message: error.message,
				// field: error.field,
				error,
			});
		}
		next();
	});
}

module.exports = multerMiddleware;
