

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
})( 'Deferred', function() {
  var state = 'pending';
  var argus = [];
  var UNFULFILLED = 'pending';

  var each = function( array, func, context ) {
    for ( var i = 0, l = array.length; i < l; i++ ) {
      func.call( context || null, array[i], i, array );
    }
  };

  var exec = function( array, argus ) {
    if ( state === UNFULFILLED ) {
      each( array, function( func ) {
        func.apply( null, argus );
      });
    }
    else {
      while( array.length ) {
        var func = array.shift();
        func.apply( null, argus );
      }
    }
  };

  var list = [
    [ 'resolve', 'done', 'resolved', [] ],
    [ 'reject', 'fail', 'rejected', [] ],
    [ 'notify', 'progress', 'pending', [] ]
  ];

  function Promise() {}
  function Deferred() {
    if ( !(this instanceof Deferred) ) return new Deferred();
    this.promise = new Promise();
  }

  Promise.prototype.stat = function () {
    return state;
  };

  Promise.prototype.isPromise = function ( o ) {
    return o instanceof Promise;
  };

  Promise.prototype.always = function () {
    this.done.apply( this, arguments );
    this.fail.apply( this, arguments );
    return this;
  };

  Promise.prototype.then = function( done, fail, progress ) {
    typeof done === 'function' && this.done( done );
    typeof fail === 'function' && this.fail( fail );
    typeof progress === 'function' && this.progress( progress );
    return this;
  };

  each( list, function ( array ) {

    // 注册
    // done/fail/progress
    // progress 注册.
    // done/fail 注册; 如果状态已更新, 就执行.
    Promise.prototype[ array[1] ] = function ( func ) {
      if ( state === UNFULFILLED ) {
        array[3].push( func );
      }
      else if ( array[2] === state ) {
        exec( [func], argus );
      }
      return this;
    };

    // 触发.
    // resolve/reject/notify
    Deferred.prototype[ array[0] ] = function () {
      if ( state === UNFULFILLED ) {
        state = array[2];
        exec( array[3], argus = arguments );
      }
      return this.promise;
    };

  });

  return Deferred;

});

