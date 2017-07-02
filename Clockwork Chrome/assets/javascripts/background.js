function onMessage(message, sender, callback) {
	if (message.action == 'getJSON') {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', message.url, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					try {
						callback(JSON.parse(xhr.responseText));
					} catch (e) {
						console.log('Invalid Clockwork metadata:');
						console.log(xhr.responseText);
					}
				} else {
					console.log('Error getting Clockwork metadata:');
					console.log(xhr.responseText);
				}
			}
		}

		Object.keys(message.headers || {}).forEach(function(headerName) {
		    xhr.setRequestHeader(headerName, message.headers[headerName]);
		});

		xhr.send();

		return true;
	}
}

chrome.runtime.onMessage.addListener(onMessage);
