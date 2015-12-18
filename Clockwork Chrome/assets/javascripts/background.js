function onRequest(request, sender, callback) {
	if (request.action == 'getJSON') {

		$.ajax({
				url: request.url,
				type: 'GET',
				dataType: 'json',
				success: callback,
				error: function(error){
					console.log('ERROR'); console.log(error);
				},
				beforeSend: function (xhr) {
					$.each(request.headers, function(headerName, headerValue) {
						xhr.setRequestHeader(headerName, headerValue);
					});
				}
		});
	}
}
chrome.extension.onRequest.addListener(onRequest);


/**
 * Logging function from the background
 */
var onMessageListener = function (message, sender, sendResponse) {
	switch (message.type) {
		case "bglog":
			console.log(message.obj);
			break;
	}
	return true;
};


var openCount = 0;
chrome.runtime.onConnect.addListener(function (port) {
	if (port.name == "devtools-page") {
		openCount++;
	}

	port.onDisconnect.addListener(function(port) {
		openCount--;
	});
});

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
		if (openCount > 0) {
			details.requestHeaders.push({'name': 'X-Clockwork', 'value': 'on'});
		}
		return {requestHeaders: details.requestHeaders};
	},
	{
		urls: ["https://*/*", "http://*/*"]
	},
	["requestHeaders", "blocking"]
);


chrome.runtime.onMessage.addListener(onMessageListener);

// var devtoolsPort = null;
// chrome.extension.onConnect.addListener(function(port) {
// 	devtoolsPort = port;
// });

// chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
// 	devtoolsPort.postMessage({});
// });

