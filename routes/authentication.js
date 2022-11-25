import express from 'express';
import {
	generateAuthenticationOptions,
	verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';

import FakeDatabase from '../repositories/FakeDatabase.js';
import InvalidRequestError from '../errors/InvalidRequestError.js';
import config from '../config.js';
import CustomError from '../errors/CustomError.js';
import UserNotFoundError from '../errors/UserNotFoundError.js';
const router = express.Router();

router.use((req, res, next) => {
	if (!req.body.username) {
		return next(new InvalidRequestError());
	}
	req.user = FakeDatabase.getUser(req.body.username);
	if (!req.user) {
		return next(new UserNotFoundError(req.body.username));
	}
	next();
});

/* GET authentication options page. */
router.post('/options', (req, res) => {
	const { user } = req;
	console.log(user);
	const options = generateAuthenticationOptions({
		allowCredentials: [
			{
				id: user.registrationInfo.credentialID,
				type: 'public-key',
			},
		],
		userVerification: 'preferred',
	});

	FakeDatabase.addUserChallenge(user.userInfo.username, options.challenge);

	res.status(200).json(options);
});

router.post('/verification', async (req, res, next) => {
	const { user } = req;
	const { credential } = req.body;

	const expectedChallenge = FakeDatabase.getUserChallenge(
		user.userInfo.username
	);

	try {
		const {
			verified,
			authenticationInfo: { newCounter },
		} = await verifyAuthenticationResponse({
			credential,
			expectedChallenge,
			expectedOrigin: config.applicationOrigin,
			expectedRPID: config.applicationId,
			authenticator: user.registrationInfo,
		});
		FakeDatabase.setUserAuthenticatorCounter(
			user.userInfo.username,
			newCounter
		);

		res.status(200).json({
			verified,
			token: jwt.sign(
				{
					username: user.userInfo.username,
				},
				config.jwtSecret
			),
		});
	} catch (err) {
		console.error(err);
		if (err instanceof CustomError) {
			next(err);
		} else {
			next(new CustomError(err.message, 400));
		}
	}
});

export default router;
