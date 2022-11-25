import config from '../config.js';
import UserAlreadyExistingError from '../errors/UserAlreadyExistingError.js';
import UserNotFoundError from '../errors/UserNotFoundError.js';

class FakeDatabase {
	#usersStore = {};
	#challengesStore = {};

	getUser(id) {
		return this.#usersStore[id];
	}

	addUser(id, user) {
		if (this.getUser(id)) {
			throw new UserAlreadyExistingError(id);
		}
		this.#usersStore[id] = user;

		return this.#usersStore[id];
	}

	setUserAuthenticatorCounter(id, counter) {
		const user = this.getUser(id);

		if (!user) {
			throw new UserNotFoundError(id);
		}

		this.#usersStore[id] = {
			...user,
			registrationInfo: {
				...user.registrationInfo,
				counter,
			},
		};

		return this.#usersStore[id];
	}

	getUserChallenge(id) {
		return this.#challengesStore[id]?.challenge;
	}

	addUserChallenge(id, challenge) {
		const timeout = setTimeout(() => {
			delete this.#challengesStore[id];
		}, config.challengeTimeout);
		this.#challengesStore[id] = {
			challenge,
			timeout,
		};
	}

	removeUserChallenge(id) {
		const stored = this.#challengesStore[id];
		if (stored) {
			clearTimeout(stored.timeout);
			delete this.#challengesStore[id];
		}
	}
}

export default new FakeDatabase();
