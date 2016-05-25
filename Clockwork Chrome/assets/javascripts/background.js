function onRequest(request, sender, callback) {
	if (request.action == 'getJSON') {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', request.url, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					callback(JSON.parse(xhr.responseText));
				} else {
					console.log('Error getting Clockwork metadata:');
					console.log(xhr.responseText);
				}
			}
		}

		Object.keys(request.headers).forEach(function(headerName) {
		    xhr.setRequestHeader(headerName, request.headers[headerName]);
		});

		xhr.send();
	}
}
chrome.extension.onRequest.addListener(onRequest);
