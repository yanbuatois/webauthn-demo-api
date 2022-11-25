export default class CustomError extends Error {
	#errorCode;
	constructor(message, errorCode = 500) {
		super(message);
		this.#errorCode = errorCode;
	}

	get errorCode() {
		return this.#errorCode;
	}
}
