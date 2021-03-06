;(function() {
    var globalEventEmitter;
    var eventEmitter = function () {
        if ( arguments.length == 0 ) {
            return globalEventEmitter || ( globalEventEmitter = new eventEmitter( 'eventEmitter_global' ) );
        }
        var callbacks = {};
        var ckeys = {};
        function listen( key, fn ) {
            callbacks[key] = callbacks[key] || [];
            callbacks[key].push( fn );
        }

        function notify( key ) {
            // 不存在事件, 不做处理.
            if ( !callbacks[key] || callbacks[key].length === 0 ) {
                callbacks[key] = null;
            }
            else {
                var argus = [].slice.call( arguments, 1 );
                var length = callbacks[key].length;
                var index = 0;
                // callbacks 会在 notify 过程中变化.
                // 所以每次重新取 callbacks[key]
                while ( index < callbacks[key].length ) {
                    var callback = callbacks[key][index++];
                    ckeys[ key ] = [];
                    // 当函数返回 false 时, 不再执行队列中函数.
                    if ( callback.apply( null, argus ) === false ) {
                        return;
                    }
                    // 在 callback 执行过程中, 去删除已处理过的 callback时,
                    // index 需要向后退.
                    for( var i = 0, l = ckeys[key].length; i < l; i++) {
                        if ( ckeys[key][i] <= index ) {
                            index--;
                        }
                    }
                    ckeys[ key ] = null;
                }
            }
        }

        // remove 单个线程, 不存在在删除过程过再添加.
        function removeListener( key, fn ) {
            var events = callbacks[key];

            if ( !events || events.length === 0 ) return;
            if ( !fn ) {
                // 全部删除时, 不再处理 notify 时的变动.
                callbacks[key].length = 0;
                return;
            }

            var needRemove = [];
            for ( var i = 0, l = events.length; i < l; i++ ) {
                if ( fn === events[i] ) {
                    needRemove[ needRemove.length ] = i;
                    // 记录当前操作 key.
                    if ( ckeys[key] ) {
                        ckeys[key].push( i );
                    }
                }
            }

            while ( needRemove.length ) {
                callbacks[key].splice( needRemove.pop(), 1 );
            }

            needRemove = null;
            if ( callbacks[key].length === 0 ) {
                callbacks[key] = null;
            }
        }

        function once( key, fn ) {
            function wrap() {
                fn.apply( null, arguments );
                removeListener( key, wrap );
            }
            listen( key, wrap );
        }
        return {
            listen: listen,
            on: listen,
            bind: listen,
            addEventListener: listen,

            notify: notify,
            emit: notify,
            trigger: notify,

            removeListener: removeListener,
            unbind: removeListener,
            off: removeListener,

            once: once,
            one: once
        };
    };
    this.eventEmitter = eventEmitter;
})();

/**
    // 测试执行过程中, 删除已执行过的 callback.
    var e = eventEmitter();
    function a() { console.log( 'a' );}
    function b() { console.log( 'b' );}
    function c() { console.log( 'c' );}
    function d() { console.log( 'd' );}
    e.listen( 'test', a );
    e.listen( 'test', b );
    e.listen( 'test', function() {
        e.unbind( 'test', a );
        e.unbind( 'test', b );
    });
    e.listen( 'test', c );
    e.listen( 'test', d );
    e.listen( 'test', function() {
        e.unbind( 'test', c );
    });
    e.listen( 'test', function() {
        console.log( 'e' );
    });

    e.emit( 'test' );
*/
