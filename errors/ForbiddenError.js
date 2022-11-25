import CustomError from './CustomError.js';

export default class ForbiddenError extends CustomError {
	constructor() {
		super('Forbidden', 401);
	}
}
