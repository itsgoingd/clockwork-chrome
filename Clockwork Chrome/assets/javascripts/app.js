var Clockwork = angular.module('Clockwork', [])
	.directive('prettyPrint', function ($parse) {
		return {
			restrict: 'E',
			replace: true,
			transclude: false,
			scope: { data: '=data' },
			link: function (scope, element, attrs) {
				var data = scope.data;
				var jason;

				if (data instanceof Object) {
					jason = new PrettyJason(data);
				} else {
					try {
						jason = new PrettyJason(data);
					} catch(e) {}
				}

				var $el = $('<div></div>');

				if (jason) {
					$el.append(jason.generateHtml());
				} else {
					$el.text(data);
				}

				element.replaceWith($el);
			}
		};
	});
