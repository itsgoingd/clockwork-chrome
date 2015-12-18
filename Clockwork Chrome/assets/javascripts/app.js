var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
};

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


				if (data.length && data.length == 1)
					data = scope.data[0];


				if (data === true) {
					data = '<i>true</i>';
				} else if (data === false) {
					data = '<i>false</i>';
				} else if (data === undefined) {
					data = '<i>undefined</i>';
				} else if (data === null) {
					data = '<i>null</i>';
				} else if (typeof data === "string") {
					data = '<pre>' + data + '</pre>';
				} else if (typeof data !== 'number') {
					try {
						data = angular.copy(data);
						jason = new PrettyJason(data);
					} catch(e) {
						data = $('<div>').text(data).html();
					}
				}

				var $el = $('<div></div>');

				if (jason) {
					$el.append(jason.generateHtml());
				} else {
					$el.html(data);
				}

				element.replaceWith($el);
			}
		};
	})
	.directive('stupidTable', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				var jqueryElm = $(elm[0]);
				$timeout(function() {
					$(jqueryElm).stupidtable();
				}, 100); //Calling a scoped method
			}
		};
	}])
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
			if (typeof input == "number")
				return $scope.formatNumber(input, decimal);
			else
				return input;
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
	.directive('resizableColumns', function ($parse) {
		return {
			link: function (scope, element, attrs) {
				var options = { minWidth: 5 };

				if ($(element).data('resizable-columns-sync')) {
					var $target = $($(element).data('resizable-columns-sync'));

					$(element).on('column:resize', function(event, resizable, $leftColumn, $rightColumn, widthLeft, widthRight)
					{
						var leftColumnIndex = resizable.$table.find('.rc-column-resizing').parent().find('td, th').index($leftColumn);

						var $targetFirstRow = $target.find('tr:first');

						$($targetFirstRow.find('td, th').get(leftColumnIndex)).css('width', widthLeft + '%');
						$($targetFirstRow.find('td, th').get(leftColumnIndex + 1)).css('width', widthRight + '%');

						$target.data('resizableColumns').syncHandleWidths();
						$target.data('resizableColumns').saveColumnWidths();
					});
				}

				$(element).resizableColumns(options);
			}
		};
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
