// will be called from backgroundpage for plugins
function onMessage(request, sender, sendResponse)
{
    switch (request.type)
    {
        case 'download':
            var filename = request.data[0],
                content = request.data[1],
                a = document.createElement('a'),
                extension = request.format;

            switch (request.format)
            {
                case 'php-serialize':
                    content = serialize(content);
                    break;
                case 'json':
                default:
                    content = JSON.stringify(content);
                    break;
            }

            var blob = new Blob([ content ], {type : "text/plain;charset=UTF-8"});

            a.href = window.URL.createObjectURL(blob);
            a.download = filename + '.' + extension;
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


// from: https://raw.githubusercontent.com/kvz/locutus/master/src/php/var/serialize.js
function serialize (mixedValue) {
    //  discuss at: http://locutus.io/php/serialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Dino
    // improved by: Le Torbi (http://www.letorbi.de/)
    // improved by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Andrej Pavlovic
    // bugfixed by: Garagoth
    // bugfixed by: Russell Walker (http://www.nbill.co.uk/)
    // bugfixed by: Jamie Beck (http://www.terabit.ca/)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Ben (http://benblume.co.uk/)
    // bugfixed by: Codestar (http://codestarlive.com/)
    //    input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
    //    input by: Martin (http://www.erlenwiese.de/)
    //      note 1: We feel the main purpose of this function should be to ease
    //      note 1: the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
    //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
    //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'

    var val, key, okey
    var ktype = ''
    var vals = ''
    var count = 0

    var _utf8Size = function (str) {
        var size = 0
        var i = 0
        var l = str.length
        var code = ''
        for (i = 0; i < l; i++) {
            code = str.charCodeAt(i)
            if (code < 0x0080) {
                size += 1
            } else if (code < 0x0800) {
                size += 2
            } else {
                size += 3
            }
        }
        return size
    }

    var _getType = function (inp) {
        var match
        var key
        var cons
        var types
        var type = typeof inp

        if (type === 'object' && !inp) {
            return 'null'
        }

        if (type === 'object') {
            if (!inp.constructor) {
                return 'object'
            }
            cons = inp.constructor.toString()
            match = cons.match(/(\w+)\(/)
            if (match) {
                cons = match[1].toLowerCase()
            }
            types = ['boolean', 'number', 'string', 'array']
            for (key in types) {
                if (cons === types[key]) {
                    type = types[key]
                    break
                }
            }
        }
        return type
    }

    var type = _getType(mixedValue)

    switch (type) {
        case 'function':
            val = ''
            break
        case 'boolean':
            val = 'b:' + (mixedValue ? '1' : '0')
            break
        case 'number':
            val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue
            break
        case 'string':
            val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"'
            break
        case 'array':
        case 'object':
            val = 'a'
            /*
             if (type === 'object') {
             var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
             if (objname === undefined) {
             return;
             }
             objname[1] = serialize(objname[1]);
             val = 'O' + objname[1].substring(1, objname[1].length - 1);
             }
             */

            for (key in mixedValue) {
                if (mixedValue.hasOwnProperty(key)) {
                    ktype = _getType(mixedValue[key])
                    if (ktype === 'function') {
                        continue
                    }

                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key)
                    vals += serialize(okey) + serialize(mixedValue[key])
                    count++
                }
            }
            val += ':' + count + ':{' + vals + '}'
            break
        case 'undefined':
        default:
            // Fall-through
            // if the JS object has a property which contains a null value,
            // the string cannot be unserialized by PHP
            val = 'N'
            break
    }
    if (type !== 'object' && type !== 'array') {
        val += ';'
    }

    return val
}