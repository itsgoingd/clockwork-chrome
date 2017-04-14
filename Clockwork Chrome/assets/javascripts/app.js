var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
};

var formatData = function(data)
{
	if (data === true) {
		data = '<i>true</i>';
	} else if (data === false) {
		data = '<i>false</i>';
	} else if (data === undefined) {
		data = '<i>undefined</i>';
	} else if (data === null) {
		data = '<i>null</i>';
	} else if (typeof data === 'number') {
		if (Math.round(data).toString() !== data) {
			data = Math.round(data * 1000) / 1000;
		}

		data = '<span>' + data + '</span>'
	} else if ($.isNumeric(data)) {
		data = '<span>' + data + '</span>'
	} else if (typeof data === "string") {
		data = '<pre>' + data + '</pre>';
	} else if (Array.isArray(data) && data.length === 0) {
		data = '<pre>[]</pre>';
	} else if (typeof(data) === 'object' && Object.keys(data).length === 0) {
		data = '<pre>{}</pre>';
	} else if (typeof data === "object") {
		data = JSON.stringify(data, null, 2);
		data = '<pre>' + data + '</pre>'
	}

	return data;
};

var Clockwork = angular.module('Clockwork', ['datatables'])

	.directive('showlog', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.on('dblclick', function() {
					if(element.attr("class").indexOf("show") !== -1) {
						element.removeClass("show");
					} else {
						element.addClass("show");
					}
				});
			}
		};
	})

	.directive('prettyPrint', function ($parse) {
		return {
			restrict: 'E',
			replace: true,
			transclude: false,
			scope: { data: '=data' },
			link: function (scope, element, attrs) {
				var data = scope.data;

				if (data && data.length && data.length === 1)
					data = scope.data[0];

				var $el = $('<div></div>');
				$el.html(formatData(data));

				element.replaceWith($el);
			}
		};
	})

	.filter('capitalize', function() {
		return function(input) {
			if (!!input) {
				return input.charAt(0).toUpperCase() + input.substr(1).replace(/([A-Z])/g, " $1");
			} else {
				return '';
			}
		}
	})

	.filter('formatValue', function() {
		return function(input, $scope, decimal) {
			decimal = typeof decimal == "undefined" ? 3 : decimal;
			if (typeof input == "number") {

				if (Math.round(input).toString() != input) {
					return $scope.formatNumber(input, decimal);
				} else {
					return input;
				}
			} else {
				return input;
			}
		}
	})

	.filter('if', function() {
		 return function(input, value) {
			 if (typeof(input) === 'string') {
				 input = [input, ''];
			 }
			 return value? input[0] : input[1];
		 };
	 })

	.filter('bytes', function() {
		return function(bytes, precision) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +	' ' + units[number];
		}
	})
	.directive('scrollToNew', function ($parse) {
		return function(scope, element, attrs) {
			if (scope.showIncomingRequests && scope.$last) {
				var $container = $(element).parents('.data-container').first();
				var $parent = $(element).parent();

				$container.scrollTop($parent.height());
			}
		};
	});
