import CustomError from './CustomError.js';

export default class InvalidRequestError extends CustomError {
	constructor() {
		super('Invalid request', 400);
	}
}
