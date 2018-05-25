let Clockwork = angular.module('Clockwork', [ 'chart.js', 'ngclipboard' ])
	.config([ '$compileProvider', ($compileProvider) => {
		$compileProvider.debugInfoEnabled(false)
		$compileProvider.commentDirectivesEnabled(false)
	} ])
	.factory('filter', [ '$timeout', ($timeout) => {
		return {
			create (tags, mapValue) { return new Filter(tags, mapValue, $timeout) }
		}
	} ])
	// .factory('profiler', () => window.profilerInstance = window.profilerInstance || new Profiler)
	.factory('profiler', () => {
		return window.profilerInstance = window.profilerInstance || new Profiler
	})
	.factory('requests', () => new Requests)
	.factory('updateNotification', () => new UpdateNotification)
	// .filter('profilerMetric', [ 'profiler', (profiler) => profiler.metricFilter() ])
	.filter('profilerMetric', [ 'profiler', (profiler) => {
		return profiler.metricFilter()
	} ])
