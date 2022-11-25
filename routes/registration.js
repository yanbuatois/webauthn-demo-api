import express from 'express';
import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
} from '@simplewebauthn/server';

import FakeDatabase from '../repositories/FakeDatabase.js';
import InvalidRequestError from '../errors/InvalidRequestError.js';
import UserAlreadyExistingError from '../errors/UserAlreadyExistingError.js';
import config from '../config.js';
import CustomError from '../errors/CustomError.js';
const router = express.Router();

/* GET authentication options page. */
router.post('/options', (req, res, next) => {
	const { username, displayName } = req.body;

	if (!username || !displayName || username.length < 3) {
		return next(new InvalidRequestError());
	}
	if (FakeDatabase.getUser(username)) {
		return next(new UserAlreadyExistingError(username));
	}

	const options = generateRegistrationOptions({
		rpName: config.applicationName,
		rpID: config.applicationId,
		userID: username,
		userName: username,
		userDisplayName: displayName,
		attestationType: 'none',
		timeout: config.challengeTimeout,
	});

	FakeDatabase.addUserChallenge(username, options.challenge);

	res.status(200).json(options);
});

router.post('/verification', async (req, res, next) => {
	const {
		userInfo: { username, displayName },
		credential,
	} = req.body;

	if (!username || !displayName || username.length < 3) {
		return next(new InvalidRequestError());
	}
	if (FakeDatabase.getUser(username)) {
		return next(new UserAlreadyExistingError(username));
	}

	const expectedChallenge = FakeDatabase.getUserChallenge(username);

	try {
		const {
			verified,
			registrationInfo: { credentialID, credentialPublicKey, counter },
		} = await verifyRegistrationResponse({
			credential,
			expectedChallenge,
			expectedOrigin: config.applicationOrigin,
			expectedRPID: config.applicationId,
		});

		FakeDatabase.addUser(username, {
			userInfo: {
				username,
				displayName,
			},
			registrationInfo: {
				credentialID,
				credentialPublicKey,
				counter,
			},
		});
		res.status(200).json({
			verified,
		});
	} catch (err) {
		console.error(err);

		if (err instanceof CustomError) {
			next(err);
		} else {
			console.error(err);
			next(new CustomError(err.message, 400));
		}
	}
});

export default router;
