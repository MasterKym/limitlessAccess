function isSuper(req, res, next) {
	// console.log(req.cookies);
	console.log(res.locals.user);
	// const loginToken = req.cookies['login-token'];
	// if (!loginToken) return res.status(401).send('You need to log in first!');
	if (!res.locals.user.isSuper) {
		return res.status(401).json({
			error: 'Invalid login type',
			message: 'You need to be looged in as super admin to do this action',
		});
	}
	try {
		next();
	} catch (err) {
		res.status(400).send('Invalid Token');
	}
}

module.exports = isSuper;
