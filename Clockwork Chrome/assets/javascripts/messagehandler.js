// will be called from backgroundpage for plugins
function onMessage(request, sender, sendResponse)
{
    switch (request.type)
    {
        case 'download':
            var filename = request.data[0],
                content = request.data[1],
                a = document.createElement('a'),
                blob = new Blob([ content ], {type : "text/plain;charset=UTF-8"});

            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            delete a;
            break;
        case 'log':
            console.log(request.data);
            break;
        case 'error':
            console.error(request.data);
            break;
    }
}