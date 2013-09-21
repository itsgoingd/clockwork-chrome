var Clockwork = angular.module('Clockwork', ['ngSanitize'])
	.filter('prettifyJson', function() {
		return function(input) {
			$escape = $('<div>');

			if (input instanceof Object) {
				$escape.text(JSON.stringify(input, undefined, 4));
				return $escape.text()
					.replace(/^ */gm, function(s){ return new Array(s.length + 1).join('&nbsp;'); })
					.replace(/\n/g, '<br>');
			} else {
				$escape.text(input);
				return $escape.text();
			}
		};
	});
