import dotenv from 'dotenv';

dotenv.config();

export default {
	applicationName: 'Adikts Webauthn Demo',
	applicationId: process.env.APPLICATION_ID,
	applicationOrigin: process.env.APPLICATION_ORIGIN,
	challengeTimeout: 2 * 60 * 1000,
	jwtSecret: process.env.JWT_SECRET,
};
