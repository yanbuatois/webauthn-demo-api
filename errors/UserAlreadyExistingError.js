import CustomError from './CustomError.js';

export default class UserAlreadyExistingError extends CustomError {
	constructor(username) {
		super(`A user with ${username} already exists`, 409);
	}
}
