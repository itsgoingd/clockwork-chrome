class Profiler
{
	constructor () {
		this.metric = 0
		this.percentual = false
		this.shownFraction = 0.9
		this.rnd = Math.random()
	}

	loadProfileForRequest (request) {
		this.request = request

		this.summary = this.metadata = this.functions = undefined

		let profile = Callgrind.parse(request.xdebug.profileData)

		this.metadata = profile.metadata
		this.summary = this.metadata.summary.split(' ')

		let budget = this.shownFraction * this.summary[this.metric]

		this.functions = profile.functions
			.filter(fn => fn.name != '{main}')
			.sort((fn1, fn2) => fn2.self[this.metric] - fn1.self[this.metric])
			.filter(fn => {
				budget -= fn.self[this.metric]
				return budget > 0
			})
			.map(fn => {
				fn.fullPath = fn.file == 'php:internal' ? 'internal' : `${fn.file}:${fn.line}`
				fn.shortPath = fn.fullPath != 'internal' ? fn.fullPath.split(/[\/\\]/).pop() : fn.fullPath
				return fn
			})
	}

	clear () {
		this.metadata = this.functions = undefined
	}

	showMetric ($event, metric) {
		$event.stopPropagation()

		this.metric = metric

		this.loadProfileForRequest(this.request)
	}

	showPercentual ($event, percentual) {
		$event.stopPropagation()

		this.percentual = percentual === true || percentual === undefined
	}

	setShownFraction ($event, shownFraction) {
		$event.stopPropagation()

		this.shownFraction = shownFraction

		this.loadProfileForRequest(this.request)
	}

	metricFilter () {
		return (item) => {
			if (this.percentual) {
				return Math.round(item[this.metric] / this.summary[this.metric] * 100) + ' %'
			} else {
				return this.metric == 1
					? Math.round(item[this.metric] / 1024) + ' kB'
					: Math.round(item[this.metric] / 100) / 10 + ' ms'
			}
		}
	}
}
