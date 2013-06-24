angular.module('Clockwork', ['ngSanitize'])
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

chrome_getJSON = function(url, callback) {
  console.log("sending RPC:" + url);
  chrome.extension.sendRequest({action:'getJSON',url:url}, callback);
};

addData = function(requestId, scope, data) {
  scope.$apply(function() {
    scope.addData(requestId, data);
  });
};

clearData = function(scope) {
  scope.$apply(function() {
    scope.clear();
  });
};
