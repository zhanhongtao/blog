

;(function( name, definition ) {
  var hasDefine = typeof define === 'function',
    hasExports = typeof module !== 'undefined' && module.exports;

  if ( hasDefine ) {
    define(definition);
  } else if (hasExports) {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
})( 'EventEmitter', function() {

  var globalEventEmitter;
  var debug = false;

  var eventEmitter = function () {

    if ( arguments.length == 0 ) {
      return globalEventEmitter || ( globalEventEmitter = new eventEmitter( 'eventEmitter_global' ) );
    }

    function flat( array ) {
      var i = 0, l = array.length, result = [], current;
      for ( ; i < l; i++ ) {
        current = array[i];
        result = result.concat( current instanceof Array ? flat(current) : current );
      }
      return result;
    }  
    
    var callbacks = {};
    var ckeys = {};

    function _bind( key, func ) {
      callbacks[ key ] = callbacks[ key ] || [];
      [].push.apply( callbacks[key], func );
    }

    // listen( name, func );
    // listen( name, func1, func2 );
    // listen( name, [f1, f2] );
    // listen( [n1, n2], func );
    // listen( [n1, n2], [f1, f2] );
    function listen( key ) { 
      var funcs = flat( [].slice.call( arguments, 1 ) );
      var keys = [].concat( key );
      for ( var i = 0, l = keys.length; i < l; i++ ) {
        _bind( keys[i], funcs );
      }
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
          try {
            if ( callback.apply( null, argus ) === false ) {
              return;
            }
          }
          catch(e) {
            if ( debug ) {
              console.log( e );
            }
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
      on: listen,
      bind: listen,
      listen: listen,
      addEventListener: listen,

      emit: notify,
      notify: notify,
      trigger: notify,
      dispatch: notify,

      off: removeListener,
      unbind: removeListener,
      removeListener: removeListener,

      once: once,
      one: once,

      debug: function( isDebug ) {
        debug = !!isDebug;
      }
    };

  };
  return eventEmitter;
});

