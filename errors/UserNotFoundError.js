import CustomError from './CustomError.js';

export default class UserNotFoundError extends CustomError {
	constructor(username) {
		super(`User with username "${username}" not found.`, 404);
	}
}
