function PanelController($scope)
{
	$scope.activeId = null;
	$scope.requests = {};

	$scope.init = function() {
		$('#tabs').tabs();
		$('.stupidtable').stupidtable();

		var port = chrome.extension.connect({name: "clear"});
		port.onMessage.addListener(function(msg) {
			clearData($scope);
		});

		console.log(port);

		key('⌘+k, ctrl+l', function(){ clearData($scope); });

		chrome.devtools.network.onRequestFinished.addListener(function(request) {
			console.log(request);

			headers = request.response.headers;
			var requestId = headers.find(function(x) { return x.name == 'X-Clockwork-Id'; });
			var requestVersion = headers.find(function(x) { return x.name == 'X-Clockwork-Version'; });

			if (requestVersion !== undefined) {
				var uri = new URI(request.request.url);
				var path = '/__clockwork/' + requestId.value;
				uri.pathname(path);

				chrome_getJSON(uri.toString(), function(data) {
					$scope.$apply(function() {
						$scope.addRequest(requestId.value, data);
					});
				});
			}
		});
	};

	$scope.activeCookies = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].cookies : null;
	};

	$scope.activeDatabaseQueries = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].databaseQueries : null;
	};

	$scope.activeGetData = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].getData : null;
	};

	$scope.activeHeaders = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].headers : null;
	};

	$scope.activeLog = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].log : null;
	};

	$scope.activePostData = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].postData : null;
	};

	$scope.activeRequest = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId] : null;
	};

	$scope.activeSessionData = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].sessionData : null;
	};

	$scope.activeTimeline = function() {
		return $scope.activeId ? $scope.requests[$scope.activeId].timelineData : null;
	};

	$scope.activeTimelineLegend = function() {
		if (!$scope.activeId) {
			return null;
		}

		var items = [];

		var maxWidth = $('.data-grid-details').width() - 230;
		var labelCount = Math.floor(maxWidth / 80);
		var step = $scope.activeRequest().responseDuration / (maxWidth - 20);

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

	$scope.clear = function() {
		$scope.requests = {};
		$scope.activeId = null;
	};

	$scope.setActive = function(requestId) {
		$scope.activeId = requestId;
	};

	$scope.getClass = function(requestId) {
		if (requestId == $scope.activeId) {
			return 'selected';
		} else {
			return '';
		}
	};

	$scope.createKeypairs = function(data) {
		var keypairs = [];

		$.each(data, function(key, value){
			keypairs.push({name: key, value: value});
		});

		return keypairs;
	};

	$scope.processHeaders = function(data) {
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

	$scope.processLog = function(data) {
		var levels = { 1: 'DEBUG', 2: 'INFO', 3: 'NOTICE', 4: 'WARNING', 5: 'ERROR' };

		$.each(data, function(key, value) {
			value.level = levels[value.level];
			value.time = new Date(value.time * 1000);
		});

		return data;
	};

	$scope.processTimeline = function(data) {
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
        $scope.$apply();
    });
}
