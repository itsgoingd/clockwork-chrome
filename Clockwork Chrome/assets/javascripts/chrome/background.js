let api = chrome || browser
let lastClockworkRequestPerTab = {}

function onMessage(message, sender, callback) {
	if (message.action == 'getJSON') {
		let xhr = new XMLHttpRequest()

		xhr.open('GET', message.url, true)

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return

			if (xhr.status != 200) {
				callback([])
				console.log('Error getting Clockwork metadata:')
				console.log(xhr.responseText)
				return
			}

			try {
				callback(JSON.parse(xhr.responseText))
			} catch (e) {
				callback([])
				console.log('Invalid Clockwork metadata:')
				console.log(xhr.responseText)
			}
		}

		Object.keys(message.headers || {}).forEach(headerName => {
			xhr.setRequestHeader(headerName, message.headers[headerName])
		})

		xhr.send()
	} else if (message.action == 'getLastClockworkRequestInTab') {
		callback(lastClockworkRequestPerTab[message.tabId])
	}

	return true
}

api.runtime.onMessage.addListener(onMessage)

// listen to http requests and send them to the app
api.webRequest.onHeadersReceived.addListener(
	request => {
		// ignore requests executed from the extension itself
		if (request.documentUrl && request.documentUrl.match(new RegExp('^moz-extension://'))) return

		// track last clockwork-enabled request per tab
		if (request.responseHeaders.find(x => x.name.toLowerCase() == 'x-clockwork-id')) {
			lastClockworkRequestPerTab[request.tabId] = request
		}

		api.runtime.sendMessage({ action: 'requestCompleted', request: request })
	},
	{ urls: [ '<all_urls>' ] },
	[ 'responseHeaders' ]
)

api.tabs.onRemoved.addListener((tabId) => delete lastClockworkRequestPerTab[tabId])
