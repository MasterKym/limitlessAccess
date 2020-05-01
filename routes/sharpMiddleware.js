const sharp = require('sharp');
const fs = require('fs');

const sharpMiddleware = async (req, res, next) => {
	res.locals.cardPhotos = [];
	let counter = 0;

	if (!req.files || req.files.length != 2) {
		return res.status(400).json({
			error: 'Provide rightly formatted studentCardPhotos',
			message: 'No images or invalid number of images',
		});
	}

	req.files.forEach((photo, index, array) => {
		sharp(photo.path)
			.png({ compressionLevel: 9 })
			.resize(580, 610)
			// .withMetadata()
			.toFile(`./uploads/sh-${photo.filename}.png`) // Decide which extension to use
			.then(() => {
				res.locals.cardPhotos.push({
					path: `uploads/sh-${photo.filename}.png`,
					mimeType: 'image/png',
				});
				counter++;
			})

			.then(() => {
				fs.unlink(`./uploads/${photo.filename}`, (err) => {
					``;
					if (err) {
						throw new Error(`Error while attempting to delete ${photo.path}`);
					}
				});
			})
			.then(() => {
				// res.locals.cardPhotos = cardPhotos;
				if (counter === array.length) {
					next();
				}
			})
			.catch((error) => {
				// console.log(error);
				throw error;
			});
	});
	// console.log('done');
	// console.log(cardPhotos);
};

module.exports = sharpMiddleware;
