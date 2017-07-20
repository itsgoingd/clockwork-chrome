let Clockwork = angular.module('Clockwork', [])
	.factory('extension', () => new Extension)
	.factory('requests', () => new Requests)
	.factory('standalone', () => new Standalone)
