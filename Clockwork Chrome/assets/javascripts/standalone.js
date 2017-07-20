class Standalone
{
	init ($scope, $http, requests) {
		this.setMetadataUrl(requests)
		this.setMetadataClient($http, requests)

		this.startPollingRequests($scope, requests)
	}

	setMetadataUrl (requests) {
		requests.setRemote('/__clockwork')
	}

	setMetadataClient ($http, requests) {
		requests.setClient((url, headers, callback) => {
			$http.get(url).then(data => callback(data.data))
		})
	}

	startPollingRequests ($scope, requests) {
		requests.loadLatest().then(() => {
			this.lastRequestId = requests.last().id

			this.pollRequests($scope, requests)
		})
	}

	pollRequests ($scope, requests) {
		requests.loadNext(null, this.lastRequestId).then(() => {
			if (requests.last()) this.lastRequestId = requests.last().id

			$scope.refreshRequests()

			setTimeout(() => this.pollRequests($scope, requests), 1000)
		})
	}
}
