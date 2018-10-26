Clockwork.filter('editorLink', [ 'settings', function (settings) {
	return function (file, line) {
		let scheme = {
			'atom': (file, line) => `atom://open?url=file://${file}&line=${line}`,
			'phpstorm': (file, line) => `phpstorm://open?url=file://${file}&line=${line}`,
			'sublime': (file, line) => `subl://open?url=file://${file}&line=${line}`,
			'textmate': (file, line) => `txmt://open?url=file://${file}&line=${line}`,
			'vs-code': (file, line) => `vscode://${file}:${line}`
		}

		let editor = settings.editor

		if (! editor || ! scheme[editor]) return

		return scheme[editor](file, line)
	}
} ])
