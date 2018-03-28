class Standalone
{
	constructor ($scope, $http, requests) {
		this.$scope = $scope
		this.$http = $http
		this.requests = requests
	}

	init () {
		this.useProperTheme()
		this.setMetadataUrl()
		this.setMetadataClient()

		this.startPollingRequests()
	}

	// dark theme can be activated by adding ?dark or ?dark=1 query string to the url, the setting is preserved
	// and can be deactivated again by adding ?dark=0
	useProperTheme () {
		let wantsDarkTheme = URI(window.location.href).query(true).dark

		if (wantsDarkTheme === undefined) {
			wantsDarkTheme = localStorage.getItem('use-dark-theme') == 'true'
		} else {
			wantsDarkTheme = wantsDarkTheme == '1' || wantsDarkTheme === null
			localStorage.setItem('use-dark-theme', wantsDarkTheme)
		}

		if (wantsDarkTheme) {
			document.querySelector('body').classList.add('dark')
		}
	}

	setMetadataUrl () {
		this.requests.setRemote(
			window.location.href, { path: URI(window.location.href.split('/').slice(0, -1).join('/')).path() + '/' }
		)
	}

	setMetadataClient () {
		this.requests.setClient((url, headers) => {
			return this.$http.get(url).then(data => data.data)
		})
	}

	startPollingRequests () {
		this.requests.loadLatest().then(() => {
			this.lastRequestId = this.requests.last().id

			this.pollRequests()
		}).catch(() => {
			setTimeout(() => this.startPollingRequests(), 1000)
		})
	}

	pollRequests () {
		this.requests.loadNext(null, this.lastRequestId).then(() => {
			if (this.requests.last()) this.lastRequestId = this.requests.last().id

			if (! this.$scope.preserveLog) {
				this.requests.setItems(this.requests.all().slice(-1))
			}

			this.$scope.refreshRequests()

			setTimeout(() => this.pollRequests(), 1000)
		}).catch(() => {
			setTimeout(() => this.pollRequests(), 1000)
		})
	}
}
