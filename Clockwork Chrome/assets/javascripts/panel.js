Clockwork.controller('PanelController', function ($scope, $http, requests)
{
	$scope.requests = []
	$scope.request = null

	$scope.timelineLegend = []

	$scope.loadingMoreRequests = false
	$scope.requestsListCollapsed = false
	$scope.showIncomingRequests = true

	$scope.init = function () {
		key('⌘+k, ctrl+l', () => $scope.$apply(() => $scope.clear()))

		if (chrome.devtools.panels.themeName === 'dark') {
			$('body').addClass('dark')
		}

		chrome.devtools.inspectedWindow.eval('window.location.href', url => requests.setRemote(url))

		chrome.devtools.network.onRequestFinished.addListener(request => {
			let options = this.parseHeaders(request.response.headers)

			if (! options) return

			requests.setRemote(request.request.url, options)
			requests.loadId(options.id).then(() => {
				$scope.$apply(() => {
					$scope.requests = requests.all()

					if ($scope.showIncomingRequests) {
						$scope.showRequest(options.id)
					}
				})
			})
		})

		chrome.runtime.sendMessage(
			{ action: 'getLastClockworkRequestInTab', tabId: chrome.devtools.inspectedWindow.tabId },
			(data) => {
				if (! data) return

				let options = this.parseHeaders(data.headers)

				requests.setRemote(data.url, options)
				requests.loadId(options.id).then(() => {
					requests.loadNext().then(() => {
						$scope.$apply(() => {
							$scope.requests = requests.all()

							$scope.showRequest(requests.first().id)
							$scope.showIncomingRequests = true
						})
					})
				})
			}
		)
	}

	$scope.parseHeaders = function (requestHeaders) {
		let id   = (found = requestHeaders.find((x) => x.name.toLowerCase() == 'x-clockwork-id'))
			? found.value : undefined
		let path = (found = requestHeaders.find((x) => x.name.toLowerCase() == 'x-clockwork-path'))
			? found.value : undefined

		if (! id) return

		let headers = {}
		requestHeaders.forEach((header) => {
			if (header.name.toLowerCase().indexOf('x-clockwork-header-') === 0) {
				let name = header.name.toLowerCase().replace('x-clockwork-header-', '')
				headers[originalName] = header.value
			}
		})

		return { id, path, headers }
	}

	$scope.clear = function () {
		requests.clear()

		$scope.requests = []
		$scope.request = null

		$scope.timelineLegend = []

		$scope.showIncomingRequests = true
	}

	$scope.showRequest = function (id) {
		$scope.request = requests.findId(id)

		$scope.timelineLegend = $scope.generateTimelineLegend()

		$scope.showIncomingRequests = (id == $scope.requests[$scope.requests.length - 1].id)
	}

	$scope.getRequestClass = function (id) {
		return $scope.request.id == id ? 'selected' : ''
	}

	$scope.showDatabaseConnectionColumn = function () {
		return $scope.request && $scope.request.databaseQueries.some(query => query.connection)
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

	$scope.generateTimelineLegend = function() {
		if (! $scope.request) return []

		let items = []

		let maxWidth = $('.timeline-graph').width()
		let labelCount = Math.floor(maxWidth / 80)
		let step = $scope.request.responseDuration / (maxWidth - 20)
		let j

		for (j = 2; j < labelCount + 1; j++) {
			items.push({
				left: (j * 80 - 35).toString(),
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

	angular.element(window).bind('resize', () => {
		$scope.$apply(() => $scope.timelineLegend = $scope.generateTimelineLegend())
    })
})
