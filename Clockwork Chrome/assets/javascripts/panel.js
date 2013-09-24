Clockwork.controller('PanelController', function PanelController($scope, $http)
{
	$scope.activeId = null;
	$scope.requests = {};

	$scope.activeCookies = [];
	$scope.activeDatabaseQueries = [];
	$scope.activeGetData = [];
	$scope.activeHeaders = [];
	$scope.activeLog = [];
	$scope.activePostData = [];
	$scope.activeRequest = [];
	$scope.activeRoutes = [];
	$scope.activeSessionData = [];
	$scope.activeTimeline = [];
	$scope.activeTimelineLegend = [];

	$scope.init = function(type)
	{
		$('#tabs').tabs();
		$('.stupidtable').stupidtable();

		if (type == 'chrome-extension') {
			$scope.initChrome();
		} else {
			$scope.initStandalone();
		}
	};

	$scope.initChrome = function()
	{
		var port = chrome.extension.connect({name: "clear"});
		port.onMessage.addListener(function(msg) {
			$scope.$apply(function() {
				$scope.clear();
			});
		});

		key('⌘+k, ctrl+l', function() {
			$scope.$apply(function() {
				$scope.clear();
			});
		});

		chrome.devtools.network.onRequestFinished.addListener(function(request) {
			console.log(request);

			headers = request.response.headers;
			var requestId = headers.find(function(x) { return x.name == 'X-Clockwork-Id'; });
			var requestVersion = headers.find(function(x) { return x.name == 'X-Clockwork-Version'; });
            var requestPath = headers.find(function(x) { return x.name == 'X-Clockwork-Path'; });

			if (requestVersion !== undefined) {
				var uri = new URI(request.request.url);
				var path = ((requestPath) ? requestPath.value : '') + '/__clockwork/' + requestId.value;
				uri.pathname(path);

				chrome.extension.sendRequest({action: 'getJSON', url: uri.toString()}, function(data){
					$scope.$apply(function(){
						$scope.addRequest(requestId.value, data);
					});
				});
			}
		});
	};

	$scope.initStandalone = function()
	{
		// generate a hash of get params from query string (http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values)
		var getParams = (function(a) {
			if (a === '') return {};
			var b = {};
			for (var i = 0; i < a.length; ++i) {
				var p = a[i].split('=');
				if (p.length != 2) continue;
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			}
			return b;
		})(window.location.search.substr(1).split('&'));

		if (getParams['id'] === undefined)
			return;

		$http.get('/__clockwork/' + getParams['id']).success(function(data){
			$scope.addRequest(getParams['id'], data);
		});
	};

	$scope.addRequest = function(requestId, data)
	{
		data.responseDurationRounded = data.responseDuration ? Math.round(data.responseDuration) : 0;
		data.databaseDurationRounded = data.databaseDuration ? Math.round(data.databaseDuration) : 0;

		data.cookies = $scope.createKeypairs(data.cookies);
		data.getData = $scope.createKeypairs(data.getData);
		data.headers = $scope.processHeaders(data.headers);
		data.postData = $scope.createKeypairs(data.postData);
		data.sessionData = $scope.createKeypairs(data.sessionData);
		data.log = $scope.processLog(data.log);
		data.timeline = $scope.processTimeline(data);

		$scope.requests[requestId] = data;
		$scope.setActive(requestId);

		$('.data-container').scrollTop(100000000);
	};

	$scope.clear = function()
	{
		$scope.requests = {};
		$scope.activeId = null;

		$scope.activeCookies = [];
		$scope.activeDatabaseQueries = [];
		$scope.activeGetData = [];
		$scope.activeHeaders = [];
		$scope.activeLog = [];
		$scope.activePostData = [];
		$scope.activeRequest = [];
		$scope.activeRoutes = [];
		$scope.activeSessionData = [];
		$scope.activeTimeline = [];
		$scope.activeTimelineLegend = [];
	};

	$scope.setActive = function(requestId)
	{
		$scope.activeId = requestId;

		$scope.activeCookies = $scope.requests[requestId].cookies;
		$scope.activeDatabaseQueries = $scope.requests[requestId].databaseQueries;
		$scope.activeGetData = $scope.requests[requestId].getData;
		$scope.activeHeaders = $scope.requests[requestId].headers;
		$scope.activeLog = $scope.requests[requestId].log;
		$scope.activePostData = $scope.requests[requestId].postData;
		$scope.activeRequest = $scope.requests[requestId];
		$scope.activeRoutes = $scope.requests[requestId].routes;
		$scope.activeSessionData = $scope.requests[requestId].sessionData;
		$scope.activeTimeline = $scope.requests[requestId].timelineData;
		$scope.activeTimelineLegend = $scope.generateTimelineLegend();
	};

	$scope.getClass = function(requestId)
	{
		if (requestId == $scope.activeId) {
			return 'selected';
		} else {
			return '';
		}
	};

	$scope.createKeypairs = function(data)
	{
		var keypairs = [];

		$.each(data, function(key, value){
			keypairs.push({name: key, value: value});
		});

		return keypairs;
	};

	$scope.generateTimelineLegend = function()
	{
		var items = [];

		var maxWidth = $('.data-grid-details').width() - 230;
		var labelCount = Math.floor(maxWidth / 80);
		var step = $scope.activeRequest.responseDuration / (maxWidth - 20);

		for (var j = 2; j < labelCount + 1; j++) {
			items.push({
				left: (j * 80 - 35).toString(),
				time: Math.round(j * 80 * step).toString()
			});
		}

		if (maxWidth - ((j - 1) * 80) > 45) {
			items.push({
				left: (maxWidth - 35).toString(),
				time: Math.round(maxWidth * step).toString()
			});
		}

		return items;
	};

	$scope.processHeaders = function(data)
	{
		var headers = [];

		$.each(data, function(key, value){
			key = key.split('-').map(function(value){
				return value.capitalize();
			}).join('-');

			$.each(value, function(i, value){
				headers.push({name: key, value: value});
			});
		});

		return headers;
	};

	$scope.processLog = function(data)
	{
		var levels = { 1: 'DEBUG', 2: 'INFO', 3: 'NOTICE', 4: 'WARNING', 5: 'ERROR' };

		$.each(data, function(key, value) {
			value.level = levels[value.level];
			value.time = new Date(value.time * 1000);
		});

		return data;
	};

	$scope.processTimeline = function(data)
	{
		var j = 1;
		var maxWidth = $('.data-grid-details').width() - 230 - 20;

		$.each(data.timelineData, function(i, value){
			value.style = 'style' + j.toString();
			value.left = (value.start - data.time) * 1000 / data.responseDuration * 100;
			value.width = value.duration / data.responseDuration * 100;

			value.durationRounded = Math.round(value.duration);

			if (value.durationRounded === 0) {
				value.durationRounded = '< 1';
			}

			j++;
			if (j > 3) j = 1;
		});

		return data.timelineData;
	};

	angular.element(window).bind('resize', function() {
		$scope.$apply(function(){
			$scope.activeTimelineLegend = $scope.generateTimelineLegend();
		});
    });
});
