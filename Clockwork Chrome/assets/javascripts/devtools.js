chrome.devtools.panels.create(
	"Clockwork",
	"assets/images/icon-toolbar.png",
	"app.html",
	function(panel) {
		var extensionId = chrome.i18n.getMessage('@@extension_id');
	}
);

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});
