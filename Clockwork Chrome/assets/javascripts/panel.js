Clockwork.controller('PanelController', function PanelController($scope, $http, toolbar, $location, $q, $filter, DTOptionsBuilder, DTColumnBuilder)
{
	$scope.activeId = null;
	$scope.activeTab = $location.path().replace("tab-", "").substr(1) ? $location.path().replace("tab-", "").substr(1) : "request";
	$scope.requests = {};
	$scope.activeData = [];
	$scope.activeLog = [];
	$scope.activeRequestData = [];
	$scope.activeRequest = [];
	$scope.activeTimeline = [];
	$scope.activeTimelineLegend = [];
	$scope.activeDatatable = {};
	$scope.showIncomingRequests = true;

	/**
	 *
	 */
	$scope.init = function()
	{
		if (typeof chrome.devtools !== "undefined") {
			$scope.initChrome();
		} else {
			$scope.initStandalone();
		}

		this.createToolbar();
	};

	/**
	 * Init a devtool version
	 */
	$scope.initChrome = function()
	{
		key('⌘+k, ctrl+l', function() {
			$scope.$apply(function() {
				$scope.clear();
			});
		});

		chrome.devtools.network.onRequestFinished.addListener(function(request)
		{
			var headers = request.response.headers;
			var requestId = headers.find(function(x) { return x.name.toLowerCase() === 'x-clockwork-id'; });
			var requestVersion = headers.find(function(x) { return x.name.toLowerCase() === 'x-clockwork-version'; });
			var requestPath = headers.find(function(x) { return x.name.toLowerCase() === 'x-clockwork-path'; });

			var requestHeaders = {};
			$.each(headers, function(i, header) {
				if (header.name.toLowerCase().indexOf('x-clockwork-header-') === 0) {
					var originalName = header.name.toLowerCase().replace('x-clockwork-header-', '');
					requestHeaders[originalName] = header.value;
				}
			});

			if (requestVersion !== undefined) {
				var uri = new URI(request.request.url);
				var path = ((requestPath) ? requestPath.value : '/__clockwork/') + requestId.value;

				path = path.split('?');
				uri.pathname(path[0]);
				if (path[1]) {
					uri.query(path[1]);
				}

				chrome.extension.sendRequest({action: 'getJSON', url: uri.toString(), headers: requestHeaders}, function(data){
					$scope.$apply(function(){
						$scope.addRequest(requestId.value, data);
					});
				});
			}
		});
	};

	/**
	 * Init a standalone version (browser)
	 */
	$scope.initStandalone = function()
	{
		// generate a hash of get params from query string
		// (http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values)
		var getParams = (function(a) {
			if (a === '') return {};
			var b = {};
			for (var i = 0; i < a.length; ++i) {
				var p = a[i].split('=');
				if (p.length !== 2) {
					continue;
				}

				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			}
			return b;
		})(window.location.search.substr(1).split('&'));

		var id = getParams['id'];
		if (id === undefined) {
			$http.get('/samples/v1.json').then(function(data){
				$scope.addRequest("2sd1f5s", data.data);
			});

			$http.get('/samples/v2_1.json').then(function(data){
				$scope.addRequest("s5df74s", data.data);
			});

			$http.get('/samples/v2_2.json').then(function(data){
				$scope.addRequest("58f07efd97b16", data.data);
			});

			$http.get('/samples/v2_3.json').then(function(data){
				$scope.addRequest("58f12d049f636", data.data);
			});
		}
		else {
			$http.get('/testdata/' + id + ".json").success(function (data) {
				$scope.addRequest(id, data);
			});
		}
	};

	/**
	 *
	 */
	$scope.createToolbar = function()
	{
		toolbar.createButton('ban', 'Clear', function()
		{
			$scope.$apply(function() {
				$scope.clear();
			});
		});

		$('.toolbar').replaceWith(toolbar.render());
	};

	/**
	 * @param {string} requestId
	 * @param {object} data
	 */
	$scope.addRequest = function(requestId, data)
	{

		data = $scope.getCompatibleData(data);

		data.responseSubDuration = $scope.getSubDuration(data);

		data.log = $scope.processLog(data.log);
		data.timeline = $scope.processTimeline(data);

		data.errorsCount = $scope.getErrorsCount(data);
		data.warningsCount = $scope.getWarningsCount(data);
		data.logsCount = data.log.length;

		$scope.requests[requestId] = data;

		if ($scope.showIncomingRequests) {
			$scope.setActive(requestId);
		}
	};

	/**
	 *
	 */
	$scope.clear = function()
	{
		$scope.requests = {};
		$scope.activeId = null;
		$scope.activeData = [];
		$scope.activeLog = [];
		$scope.activeRequestData = [];
		$scope.activeRequest = [];
		$scope.activeTimeline = [];
		$scope.activeTimelineLegend = [];
		$scope.activeDatatable = {};
		$scope.showIncomingRequests = true;
	};

	/**
	 * @param {string} requestId
	 */
	$scope.setActive = function(requestId)
	{
		$scope.activeId = requestId;
		$scope.activeTab = "request";
		$scope.activeData = $scope.requests[requestId].data;
		$scope.activeLog = $scope.requests[requestId].log;
		$scope.activeRequestData = $scope.requests[requestId].request;
		$scope.activeRequest = $scope.requests[requestId];
		$scope.activeTimeline = $scope.requests[requestId].timeline;
		$scope.activeTimelineLegend = $scope.generateTimelineLegend();

		if (
				$scope.activeTab === "log" && $scope.activeLog.length === 0 ||
				$scope.activeTab === "timeline" && $scope.activeTimeline.length === 0 ||
				($scope.activeTab !== "log" && $scope.activeTab !== "timeline"	&& typeof($scope.activeData[$scope.activeTab]) === "undefined")
		) {
			$scope.activeTab = 'request';
		}

		var lastRequestId = Object.keys($scope.requests)[Object.keys($scope.requests).length - 1];

		$scope.showIncomingRequests = requestId === lastRequestId;

		// datatable
		var capitalize = $filter('capitalize');

		$.each($scope.activeData, function(mainName, mainData) {
			$.each(mainData, function (sectionName, sectionData) {
				var columns = [];
				$.each(Object.keys(sectionData[0]), function (key, value)
				{
					var col = DTColumnBuilder
						.newColumn(value)
						.renderWith(function (data, type, full, meta)
						{
							return formatData(data);
						})
						.withTitle(capitalize(value))
					;

					columns.push(col);
				});

				$scope.activeDatatable[mainName] = $scope.activeDatatable[mainName] ?
					$scope.activeDatatable[mainName] :
					{};
				$scope.activeDatatable[mainName][sectionName] = $scope.activeDatatable[mainName][sectionName] ?
					$scope.activeDatatable[mainName][sectionName] :
					{};

				$scope.activeDatatable[mainName][sectionName]['columns'] = columns;
				$scope.activeDatatable[mainName][sectionName]['options'] = DTOptionsBuilder.fromFnPromise(function ()
				{
					var defer = $q.defer();
					defer.resolve(sectionData);
					return defer.promise;
				}).withPaginationType('full_numbers');

			});
		});

	};

	/**
	 * @param {string} tab
	 */
	$scope.setActiveTab = function(tab)
	{
		$scope.activeTab = tab;
	};

	/**
	 * @param {string} requestId
	 * @return {string}
	 */
	$scope.getClass = function(requestId)
	{
		if (requestId === $scope.activeId) {
			return 'selected';
		} else {
			return '';
		}
	};

	/**
	 * @param value
	 * @returns {string}
	 */
	$scope.getSortType = function(value)
	{
		if (value === parseInt(value))
			return "int";
		if (value === parseFloat(value))
			return "float";

		return "string-ins";
	};

	/**
	 * @param {number} number
	 * @param {number=} decimals
	 * @returns {string}
	 */
	$scope.formatNumber = function(number, decimals)
	{
		decimals = typeof(decimals) === "undefined" ? 3 : decimals;
		number = parseFloat(number);
		var decPoint = '.';
		var thousandsSep = ' ';


		var roundedNumber = Math.round( Math.abs( number ) * ('1e' + decimals) ) + '';
		var numbersString = decimals ? roundedNumber.slice(0, decimals * -1) : roundedNumber;
		if (!numbersString)
			numbersString = "0";

		var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
		var formattedNumber = "";

		while(numbersString.length > 3){
			formattedNumber += thousandsSep + numbersString.slice(-3);
			numbersString = numbersString.slice(0,-3);
		}

		return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
	};
	/**
	 * @param {object} data
	 * @param {number} decimals
	 * @returns {string}
	 */
	$scope.getSubDuration = function(data, decimals)
	{
		var duration = 0;

		if (!data.data)
			return duration;

		$.each(data.data, function(title, data) {

			$.each(data, function (index, section) {

				if (typeof section === "object") {
					$.each(section, function (index, sectionRow) {
						 if (sectionRow.duration) {
							 duration += sectionRow.duration;
						 }
					});
				}
			});
		});

		return $scope.formatNumber(duration, decimals) + " ms";
	};

	/**
	 * @param {object} data
	 * @param {number} decimals
	 * @returns {string}
	 */
	$scope.getDataDuration = function(data, decimals)
	{
		var duration = 0;

		$.each(data, function(title, section) {

			if (typeof section === "object") {
				$.each(section, function (index, sectionRow) {
					 if (sectionRow.duration)
					 duration += sectionRow.duration;
				});
			}
		});

		return $scope.formatNumber(duration, decimals) + " ms";
	};

	/**
	 * @param {object} section
	 * @returns {string}
	 */
	$scope.getSectionDuration = function(section)
	{
		var duration = 0 ;

		$.each(section, function(index, sectionRow) {

			$.each(sectionRow, function(cols, value) {
				if (cols === "duration")
					duration += value;
			});
		});

		return $scope.formatNumber(duration) + " ms";
	};

	/**
	 * @return {Array}
	 */
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

	/**
	 * @param {object} data
	 * @return {object}
	 */
	$scope.processLog = function(data)
	{
		if (!(data instanceof Object)) {
			return [];
		}

		$.each(data, function(key, value) {
			value.time = new Date(value.time * 1000);
		});

		return data;
	};

	/**
	 * @param {object} data
	 * @return {Array}
	 */
	$scope.processTimeline = function(data)
	{
		var i = 0;
		var j = 1;
		var timeline = [],
				timelinedata = data.timelineData;

		if (data.data) {
			$.each(data.data, function (title, data) {

				$.each(data, function (subtitle, section) {

					if (typeof section === "object") {
						$.each(section, function (index, sectionRow) {
							if (sectionRow.duration !== "undefined" && sectionRow.start !== "undefined" ) {
								if (typeof timelinedata[title + " " + subtitle] === "undefined") {
									timelinedata[title + " " + subtitle] = [];
								}

								timelinedata[title + " " + subtitle].push({
									"start": sectionRow.start,
									"end": sectionRow.start + sectionRow.duration,
									"duration": sectionRow.duration
								});

								delete sectionRow.start;
							}
						});
					}
				});
			});
		}

		$.each(timelinedata, function(name, currentTimeline){

			$.each(currentTimeline, function(index, value){
				value.style = 'style' + j.toString();
				value.left = (value.start - data.time) * 1000 / data.responseDuration * 100;
				value.width = value.duration / data.responseDuration * 100;

				if (value.width > 100) value.width = 100;

				if (typeof timeline[i] === "undefined") {
					timeline[i] = {"duration" : 0};
					timeline[i].line = [];
				}

				timeline[i].duration += value.duration;
				timeline[i].description = name;

				timeline[i].line.push(value);

			});
			if (++j > 3) j = 1;
			i++;
		});

		return timeline;
	};

	/**
	 * @param {object} data
	 * @return {number}
	 */
	$scope.getErrorsCount = function(data)
	{
		var count = 0;

		$.each(data.log, function(index, record)
		{
			if (record.level === 'error') {
				count++;
			}
		});

		return count;
	};

	/**
	 * @param {object} data
	 * @return {number}
	 */
	$scope.getWarningsCount = function(data)
	{
		var count = 0;

		$.each(data.log, function(index, record)
		{
			if (record.level === 'warning') {
				count++;
			}
		});

		return count;
	};


	/**
	 * Return compatible data with v1
	 */
	$scope.getCompatibleData = function(data) {

		data.data = data.data || {};


		data.request = data.request || {};

		if (data.getData) {
			data.request["get"] = data.getData;
			delete data.getData;
		}

		if (data.postData) {
			data.request["post"] = data.postData;
			delete data.postData;
		}

		if (data.cookies) {
			data.request["cookies"] = data.cookies;
			delete data.cookies;
		}

		if (data.headers) {
			data.request["headers"] = data.headers;
			delete data.headers;
		}

		if (data.sessionData) {
			data.request["session"] = data.sessionData;
			delete data.sessionData;
		}

		if (data.routes) {
			data.data["Routes"] = {"Request": data.routes};
			delete data.routes;
		}

		if (data.emails) {
			data.data["Emails"] = {"Emails" : data.emails};
			delete data.emails;
		}

		if (data.views) {
			data.data["Views"] = {"Views" : data.views};
			delete data.views;
		}

		if (data.databaseQueries) {
			data.data["Database"] = {"Query": data.databaseQueries};
			delete data.databaseQueries;
		}

		if (data.views) {
			data.data["Views"] = {"Views" : data.views};
			delete data.views;
		}

		var timelineData = {};
		$.each(data.timelineData, function(name, currentTimeline) {
			if (typeof currentTimeline.start !== "undefined") {
				timelineData[currentTimeline.description] = [currentTimeline];
			}
		});

		if (Object.keys(timelineData).length > 0) {
			data.timelineData = timelineData;
		}

		return data;
	};

	angular.element(window).bind('resize', function() {
		$scope.$apply(function(){
			$scope.activeTimelineLegend = $scope.generateTimelineLegend();
		});
	});
});
