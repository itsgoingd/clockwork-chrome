function onRequest(request, sender, callback) {
	if (request.action == 'getJSON') {
		$.getJSON(request.url, callback, function(error){ console.log('ERROR'); console.log(error); });
	}
}
chrome.extension.onRequest.addListener(onRequest);

var devtoolsPort = null;
chrome.extension.onConnect.addListener(function(port) {
	devtoolsPort = port;
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	devtoolsPort.postMessage({});
});
