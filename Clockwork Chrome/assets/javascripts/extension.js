class Extension
{
	get api () { return chrome || browser }

	runningAsExtension () {
		return this.api && this.api.devtools
	}

	init ($scope, requests) {
		this.useProperTheme()
		this.setMetadataUrl(requests)
		this.setMetadataClient(requests)

		this.listenToRequests($scope, requests)

		this.loadLastRequest($scope, requests)
	}

	useProperTheme () {
		if (this.api.devtools.panels.themeName === 'dark') {
			$('body').addClass('dark')
		}
	}

	setMetadataUrl (requests) {
		this.api.devtools.inspectedWindow.eval('window.location.href', url => requests.setRemote(url))
	}

	setMetadataClient (requests) {
		requests.setClient((url, headers, callback) => {
			this.api.runtime.sendMessage(
				{ action: 'getJSON', url, headers }, (data) => callback(data)
			)
		})
	}

	listenToRequests ($scope, requests) {
		this.api.devtools.network.onRequestFinished.addListener(request => {
			let options = this.parseHeaders(request.response.headers)

			if (! options) return

			requests.setRemote(request.request.url, options)
			requests.loadId(options.id).then(() => {
				$scope.$apply(() => $scope.refreshRequests())
			})
		})
	}

	loadLastRequest ($scope, requests) {
		this.api.runtime.sendMessage(
			{ action: 'getLastClockworkRequestInTab', tabId: this.api.devtools.inspectedWindow.tabId },
			(data) => {
				if (! data) return

				let options = this.parseHeaders(data.headers)

				requests.setRemote(data.url, options)
				requests.loadId(options.id).then(() => {
					requests.loadNext().then(() => {
						$scope.$apply(() => $scope.refreshRequests())
					})
				})
			}
		)
	}

	parseHeaders (requestHeaders) {
		let found
		let id = (found = requestHeaders.find((x) => x.name.toLowerCase() == 'x-clockwork-id'))
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
}
