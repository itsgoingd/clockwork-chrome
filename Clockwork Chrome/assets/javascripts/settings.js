class Settings
{
	constructor () {
		let settings = this.loadSettings()

		this.editor = settings.global.editor
	}


	save() {
		let settings = this.loadSettings()

		settings.global.editor = this.editor

		localStorage.setItem('settings', JSON.stringify(settings))
	}

	loadSettings() {
		let defaultSettings = { global: { editor: null }, site: {} }

		return angular.merge(defaultSettings, JSON.parse(localStorage.getItem('settings')));
	}
}
