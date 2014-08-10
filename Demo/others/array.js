



Array.isArray = function (source) {
    return Object.prototype.toString.call(source) === '[object Array]';
};
Array.prototype.filter = function (source, fn, context) {
    var arr = [].concat(source), result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
        if (fn.call(context || null, arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }
    return result;
};

Array.prototypeevery = function (source, fn, context) {
    var arr = [].concat(source);
    for (var i = 0, l = arr.length; i < l; i++) {
        if (!fn.call(context || null, arr[i], i, arr)) {
            return false;
        }
    }
    return true;
};

Array.prototype.some = function (source, fn, context) {
    var arr = [].concat(source);
    for (var i = 0, l = arr.length; i < l; i++) {
        if (!fn.call(context || null, arr[i], i, arr)) {
            return true;
        }
    }
    return false;
};

Array.prototype.forEach = function (source, fn, context) {
    var arr = [].concat(source);
    for (var i = 0, l = arr.length; i < l; i++) {
        fn.call(context || null, arr[i], i, arr);
    }
};

Array.prototype.map = function (source, fn, context) {
    var arr = [].concat(source);
    var result = [];
    for (var i = 0, l = source.length; i < l; i++) {
        result.push(fn.call(context || null, arr[i], i, arr));
    }
    return result;
};
Array.prototype.indexOf = function (source, target, fromIndex) {
    var arr = [].concat(source),
        len = arr.length,
        fromIndex = fromIndex | 0;
    if (fromIndex < 0) {
        fromIndex = Math.max(0, fromIndex + len);
    }

    for (; fromIndex < len; fromIndex++) {
        if (fromIndex in arr && arr[fromIndex] === target) {
            return fromIndex;
        }
    }
    return -1;
};

Array.prototype.lastIndexOf = function (source, target, fromIndex) {
    var arr = [].concat(source),
        len = arr.length,
        fromIndex = fromIndex | 0;
    if (fromIndex < 0) {
        fromIndex = Math.max(0, fromIndex + len);
    }

    for (; fromIndex < len; len--) {
        if (len in arr && arr[len] === target) {
            return len;
        }
    }
    return -1;

};