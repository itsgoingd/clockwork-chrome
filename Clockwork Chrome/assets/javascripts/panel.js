Clockwork.controller('PanelController', function ($scope, $http, filter, requests, updateNotification)
{
	$scope.requests = []
	$scope.request = null

	$scope.timelineLegend = []

	$scope.loadingMoreRequests = false
	$scope.preserveLog = true
	$scope.requestsListCollapsed = false
	$scope.showIncomingRequests = true

	$scope.expandedEvents = []

	$scope.init = function () {
		key('⌘+k, ctrl+l', () => $scope.$apply(() => $scope.clear()))

		if (Extension.runningAsExtension()) {
			$scope.$integration = new Extension($scope, requests, updateNotification)
		} else {
			$scope.$integration = new Standalone($scope, $http, requests)
		}

		$scope.$integration.init()

		this.initFilters()
	}

	$scope.initFilters = function () {
		$scope.headersFilter = filter.create([
			{ tag: 'name' }
		])

		$scope.getDataFilter = filter.create([
			{ tag: 'name' }
		])

		$scope.postDataFilter = filter.create([
			{ tag: 'name' }
		])

		$scope.cookiesFilter = filter.create([
			{ tag: 'name' }
		])

		$scope.eventsFilter = filter.create([
			{ tag: 'time', type: 'date' },
			{ tag: 'file', map: item => item.shortPath }
		])

		$scope.databaseQueriesFilter = filter.create([
			{ tag: 'model' },
			{ tag: 'type', apply: (item, tagValue) => {
				let types = [ 'select', 'update', 'insert', 'delete' ]
				if (types.includes(tagValue.toLowerCase())) {
					return item.query.match(new RegExp(`^${tagValue.toLowerCase()}`, 'i'))
				}
			} },
			{ tag: 'file', map: item => item.shortPath },
			{ tag: 'duration', type: 'number' }
		])

		$scope.cacheQueriesFilter = filter.create([
			{ tag: 'action', apply: (item, tagValue) => {
				let actions = [ 'read', 'write', 'delete', 'miss' ]
				if (actions.includes(tagValue.toLowerCase())) {
					return item.type.toLowerCase() == tagValue.toLowerCase()
				}
			} },
			{ tag: 'key' },
			{ tag: 'file', map: item => item.shortPath }
		])

		$scope.logFilter = filter.create([
			{ tag: 'time', type: 'date' },
			{ tag: 'level' },
			{ tag: 'file', map: item => item.shortPath }
		], item => item.message)

		$scope.sessionFilter = filter.create([
			{ tag: 'name' }
		])

		$scope.viewsFilter = filter.create([
			{ tag: 'name' }
		])

		$scope.emailsFilter = filter.create([
			{ tag: 'to' }
		])

		$scope.routesFilter = filter.create([
			{ tag: 'method', apply: (item, tagValue) => {
				let methods = [ 'get', 'post', 'put', 'delete', 'head', 'patch' ]
				if (methods.includes(tagValue.toLowerCase())) {
					return item.method.toLowerCase() == tagValue.toLowerCase()
				}
			} },
			{ tag: 'uri' }
		])
	}

	$scope.clear = function () {
		requests.clear()

		$scope.requests = []
		$scope.request = null

		$scope.timelineLegend = []

		$scope.showIncomingRequests = true

		$scope.expandedEvents = []
	}

	$scope.refreshRequests = function (activeRequest) {
		$scope.requests = requests.all()

		if (! $scope.preserveLog) {
			$scope.showRequest($scope.requests[0].id)
		} else if ($scope.showIncomingRequests && $scope.requests.length) {
			$scope.showRequest(activeRequest ? activeRequest.id : $scope.requests[$scope.requests.length - 1].id)
			$scope.showIncomingRequests = true
		}
	}

	$scope.showRequest = function (id) {
		$scope.request = requests.findId(id)

		$scope.updateNotification = updateNotification.show(requests.remoteUrl)
		$scope.timelineLegend = $scope.generateTimelineLegend()

		$scope.showIncomingRequests = (id == $scope.requests[$scope.requests.length - 1].id)
	}

	$scope.getRequestClass = function (id) {
		return $scope.request && $scope.request.id == id ? 'selected' : ''
	}

	$scope.showDatabaseConnectionColumn = function () {
		if (! $scope.request) return

		let connnections = $scope.request.databaseQueries
			.map(query => query.connection)
			.filter((connection, i, connections) => connections.indexOf(connection) == i)

		return connnections.length > 1
	}

	$scope.showCacheTab = function () {
		let cacheProps = [ 'cacheReads', 'cacheHits', 'cacheWrites', 'cacheDeletes', 'cacheTime' ]

		if (! $scope.request) return

		return cacheProps.some(prop => $scope.request[prop]) || $scope.request.cacheQueries.length
	}

	$scope.showCacheQueriesConnectionColumn = function () {
		return $scope.request && $scope.request.cacheQueries.some(query => query.connection)
	}

	$scope.showCacheQueriesDurationColumn = function () {
		return $scope.request && $scope.request.cacheQueries.some(query => query.duration)
	}

	$scope.generateTimelineLegend = function () {
		if (! $scope.request) return []

		let items = []
		let maxWidth = $scope.getTimelineWidth()
		let labelCount = Math.floor(maxWidth / 80)
		let step = $scope.request.responseDuration / (maxWidth - 20)
		let j

		for (j = 2; j < labelCount + 1; j++) {
			items.push({
				left: (j * 80 - 40).toString(),
				time: Math.round(j * 80 * step).toString()
			})
		}

		if (maxWidth - ((j - 1) * 80) > 45) {
			items.push({
				left: (maxWidth - 35).toString(),
				time: Math.round(maxWidth * step).toString()
			});
		}

		return items
	}

	$scope.getTimelineWidth = function () {
		let timelineShown = $('[tab-content="timeline"]').css('display') !== 'none'

		if (! timelineShown) $('[tab-content="timeline"]').show()

		let width = $('.timeline-graph').width()

		if (! timelineShown) $('[tab-content="timeline"]').hide()

		return width
	}

	$scope.loadMoreRequests = function () {
		$scope.loadingMoreRequests = true

		requests.loadPrevious(10).then(() => {
			$scope.$apply(() => {
				$scope.requests = requests.all()
				$scope.loadingMoreRequests = false
			})
		})
	}

	$scope.toggleRequestsList = function () {
		$scope.requestsListCollapsed = ! $scope.requestsListCollapsed
	}

	$scope.togglePreserveLog = function () {
		$scope.preserveLog = ! $scope.preserveLog
	}

	$scope.isEventExpanded = function (event) {
		return $scope.expandedEvents.indexOf(event) !== -1
	}

	$scope.toggleEvent = function (event) {
		if ($scope.isEventExpanded(event)) {
			$scope.expandedEvents = $scope.expandedEvents.filter(item => item != event)
		} else {
			$scope.expandedEvents.push(event)
		}
	}

	$scope.closeUpdateNotification = function () {
		$scope.updateNotification = null

		updateNotification.ignoreUpdate(requests.remoteUrl)
	}

	angular.element(window).bind('resize', () => {
		$scope.$apply(() => $scope.timelineLegend = $scope.generateTimelineLegend())
    })
})
