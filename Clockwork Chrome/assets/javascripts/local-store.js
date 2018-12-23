class LocalStore
{
	static isPersistent() {
		try {
			return localStorage !== undefined
		} catch (e) {
			return false
		}
	}

	static get(key) {
		try {
			return JSON.parse(localStorage.getItem(key))
		} catch (e) {
			return this.temporary ? this.temporary[key] : undefined
		}
	}

	static set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch (e) {
			if (! this.temporary) this.temporary = {}
			this.temporary[key] = value
		}
	}
}