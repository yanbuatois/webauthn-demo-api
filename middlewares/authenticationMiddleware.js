import jwt from 'jsonwebtoken';

import ForbiddenError from '../errors/ForbiddenError.js';
import config from '../config.js';
import FakeDatabase from '../repositories/FakeDatabase.js';

const authenticationMiddleware = (req, res, next) => {
	const { authorization } = req.headers;

	const token = authorization?.split(' ')?.[1];
	if (!token) {
		return next(new ForbiddenError());
	}

	try {
		const { username } = jwt.verify(token, config.jwtSecret);
		const user = FakeDatabase.getUser(username);
		if (!user) {
			return next(new ForbiddenError());
		}

		req.user = user.userInfo;

		return next();
	} catch (e) {
		return next(new ForbiddenError());
	}
};

export default authenticationMiddleware;
