function onRequest(request, sender, callback) {
	if (request.action == 'getJSON') {
		$.ajax({
            url: request.url,
            type: 'GET',
            dataType: 'json',
            success: callback,
            error: function(error){
                console.log('ERROR'); console.log(error);
            },
            beforeSend: function (xhr) {
                $.each(request.headers, function(headerName, headerValue) {
                    xhr.setRequestHeader(headerName, headerValue);
                });
            }
        });
	}
}
chrome.extension.onRequest.addListener(onRequest);
