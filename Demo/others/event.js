



var eventManager = (function () {

    // 事件管理器存储中心.
    var storage = {};

    // 随机数, 以备绑定到元素和处理函数.
    var rand = (new Date()).getTime();

    // 页面唯一值, 以备做为元素自定义属性绑定.
    // (和 event 管理器关联)
    var pageID = 'event_manager_by_zz_' + rand;

    // 处理函数是否仅执行一次
    var fnone = pageID + '_one';

    // 空处理函数, 以备在未添加绑定函数时, 填充默认值.
    var noop = function () {};

    // 兼容绑定与反绑定函数.
    var w3c = document.addEventListener;
    var bindEvent = w3c ?
        function (elem, type, fn) {elem.addEventListener(type, fn, false);} :
        function (elem, type, fn) {elem.attachEvent('on' + type, fn);};
    var unbindEvent = w3c ?
        function (elem, type, fn) {elem.removeEventListener(type, fn, false);} :
        function (elem, type, fn) {elem.detachEvent('on' + type, fn);};


    /*
        判断是否为空对象
        @param {Object} obj
        @return {Boolean}
     */
    function isEmptyObject(obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    }

    var createListener = function (guid) {
        return function (e) {

            var manager = storage[guid];
            var elem = manager.elem;
            var events = manager.events;

            // TODO: 兼容 event
            var type = e.type;
            var typeEvents = events[type];
            var globalEvents = typeEvents.global;
            var ret = false;

            try {
                for (var i = 0; i < globalEvents.length; i++) {

                    var tmp = globalEvents[i].apply(elem, arguments);
                    if (tmp === false) {
                        ret = true;
                    }

                    if (globalEvents[i][fnone]) {
                        globalEvents[i][fnone] = null;
                        globalEvents.splice(i, 1);
                    }

                }

                for (var name in userEvents) {
                    var tmp = userEvents[name].apply(elem, arguments);
                    if (tmp === false) {
                        ret = true;
                    }

                    if (userEvents[name][fnone]) {
                        userEvents[name][fnone] = null;
                        delete userEvents[name][fnone];
                    }
                }

            }
            finally {

                if (ret) {
                    e.preventDefault();
                    e.stopPropagation();
                }

            }

        };
    };

    /**
        @param {dom} elem dom 元素.
        @param {string} type 事件类型.
        @param {function} fn 事件处理函数.
        @param {boolean} one 是否仅执行一次.
     */
    var bind = function (elem, type, fn, one) {

        // 存储 DOM 元素和事件关联指针.
        var guid = elem[pageID] || (elem[pageID] = ++rand);

        // 存储元素和事件.
        var manager = storage[guid] || (storage[guid] = {});

        // elem 首次绑定事件时, 添加到存储中.
        !manager.elem && (manager.elem = elem);

        // 事件存储器.
        var events = manager.events || (manager.events = {});

        // 支持一级命名空间.
        var isHasNamespace = type.indexOf('.');
        if (isHasNamespace > -1) {
            var namespace = type.slice(isHasNamespace + 1);
            type = type.slice(0, isHasNamespace);
        }
        var typeEvents = events[type] || (events[type] = {});

        // 存储全局当前 type 处理函数.
        var globalEvents = typeEvents.global || (typeEvents.global = []);

        // 存储用户定义命名空间事件.
        var userEvents = typeEvents.user || (typeEvents.user = {});

        // 绑定是否仅执行一次.
        one && (fn[fnone] = true);

        // 标记当前处理函数.
        fn[pageID] = ++rand;

        namespace ? (userEvents[namespace] = fn) : (globalEvents.push(fn));

        var listener = createListener(guid);

        // listener 是直接执行的.
        bindEvent(elem, type, listener);

        console.log(storage);
    };

    var unbind = function (elem, type, fn) {

        // 如果 DOM 元素, 本身未绑定事件, 直接返回.
        var guid = elem[pageID];
        if (!guid) {
            return;
        }

        var manager = storage[guid];
        var elem = manager.elem;
        var events = manager.events;

        // 如果存在事件命名空间, 取命名空间并且更新 type.
        var isHasNamespace = type.indexOf('.');
        if (isHasNamespace > -1) {
            var namespace = type.slice(isHasNamespace + 1);
            type = type.slice(0, isHasNamespace);
        }

        // 如果 DOM 元素未绑定 type 事件, 直接返回.
        var typeEvents = events[type];
        if (!typeEvents) {
            return;
        }

        var globalEvents = typeEvents.global;
        var userEvents = typeEvents.user;
        var fnid = fn[pageID];
        var ufn = noop;

        if (userEvents && (ufn = userEvents[namespace])) {
            if (ufn[pageID] == fnid) {
                userEvents[namespace] = null;
                delete userEvents[namespace];
            }
        }
        else {
            for (var i = 0, l = globalEvents.length; i < l; i++) {
                var tmp = globalEvents[i];
                if (tmp[pageID] == fnid) {
                    break;
                }
            }

            if (i < l) {
                globalEvents[i][pageID] = null;
                globalEvents.splice(i, 1);
                return;
            }
        }

        // 判断 globalEvents 中是否还存在 处理函数.
        // 判断 userEvents 中是否还有其它属性.
        if (globalEvents.length == 0) {
            delete typeEvents.global;
        }

        if (isEmptyObject(userEvents)) {
            delete typeEvents.user;
        }

        if (globalEvents.length == 0 && isEmptyObject(userEvents)) {
            delete storage[guid];
        }


    };

    return {
        bind: bind,
        unbind: unbind
    };

}());



