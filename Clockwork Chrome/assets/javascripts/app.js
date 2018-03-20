let Clockwork = angular.module('Clockwork', [])
	.factory('filter', [ '$timeout', ($timeout) => {
		return {
			create (tags, mapValue) { return new Filter(tags, mapValue, $timeout) }
		}
	} ])
	.factory('requests', () => new Requests)
	.factory('updateNotification', () => new UpdateNotification)
