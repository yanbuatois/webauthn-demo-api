import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';

import CustomError from './errors/CustomError.js';
import isAlive from './routes/isalive.js';
import registrationRouter from './routes/registration.js';
import authenticationRouter from './routes/authentication.js';
import userRouter from './routes/user.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/isAlive', isAlive);
app.use('/user', userRouter);
app.use('/registration', registrationRouter);
app.use('/authentication', authenticationRouter);
app.use((err, req, res, next) => {
	if (err instanceof CustomError) {
		return res.status(err.errorCode).json({
			message: err.message,
		});
	} else {
		console.error(err);
		return res.status(500).json({
			message: 'Internal server error',
		});
	}
});

app.use((req, res) => {
	return res.status(404).json({
		message: 'Not found',
	});
});
export default app;
