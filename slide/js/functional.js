

function bind( func, context ) {
  return function() {
    return func.apply( context || this, arguments );
  }
}

function type( s ) {
  return Object.prototype.toString.call(s).slice(8, -1).toLowerCase();
}

function flatArray( array ) {
  var i = 0, l = array.length, result = [], current;
  for ( ; i < l; i++ ) {
    current = array[i];
    result = result.concat( current instanceof Array ? flatArray(current) : current );
  }
  return result;
}

function partial( func ) {
  var argus = [].slice.call( arguments, 1 );
  return function() {
    return func.apply( this, argus.concat([].slice.call(arguments)) );
  };
}

function once( func ) {
  var flag, result;
  return function() {
    if ( flag ) return result;
    flag = true;
    result = func.apply( this, arguments );
    return result;
  };
}

function wrap( self, func ) {
  return function() {
    var _arguments = arguments;
    var next = function() {
      var argus = arguments.length ? arguments : _arguments;
      return self.apply( null, argus );
    };
    var argus = [].slice.call( arguments );
    var length = func.length;
    argus = length < 2 ? [] : argus.slice( 0, length - 1);
    argus.push( next );
    return func.apply( null, argus );
  };
}

// wait 时间内, 只执行最后一次调用.
// ex:
// * 按钮多次点击, 只执行最后一次 - 创建快捷方式
// * 事件多次触发, 只需处理一次 - tab->update, pagezoomchanged
// * blur 和 button 同时执行 save 操作.
function debounce( func, wait ) {
  var old = new Date;
  var func = typeof func === 'function' ? func : function() {};
  var timer;
  function ret() {
    if ( timer ) {
      clearTimeout( timer );
      timer = null;
    }
    var argus = arguments;
    timer = setTimeout(function() {
      timer = null;
      func.apply( null, argus );
    }, wait);
    return ret;
  };
  return ret;
}

function throttle( func, wait ) {
  var timer;
  var previous = 0;
  var args;
  var context;
  var later = function() {
    previous = new Date;
    func.apply( context, args );
  };
  return function() {
    var now = new Date;
    if ( previous === 0 ) previous = new Date;
    args = arguments;
    context = this;
    var remaining = wait - ( now - previous );
    if ( remaining <= 0 ) {
      func.apply( this, arguments );
      timer = null;
      previous = now;
    }
    else if ( !timer ) {
      timer = setTimeout( later, remaining );
    }
  };
}

function after( count, func ) {
  var n = ~~count;
  var old = n;
  var func = typeof func === 'function' ? func : function() {};
  var ret = function() {
    n--;
    if ( n === 0 ) {
      func.apply( this, arguments );
      n = old;
    }
    return ret;
  }
  return ret;
}

// 队列
// 存在依赖关系时使用 queue.
// ex:
// * 类似 jQuery 中的 queue.
// * http 相关的单元测试.
function queue( list, fn, callback, ret ) {

    var length = list.length;

    // 在 ret 中记录原始长度.
    ret = ret || [ length ];

    // 不污染原始数组.
    var old = ret[0] === length ? [].concat(list) : list;

    // value -> 当前返回值.
    // stop -> 是否停止运行, 并且只把当前 ret 返回给 callback.
    // returnCurrentValue -> 需要 stop 为真. 只返回当前 value 给 callback.
    var next = function ( value, stop, returnCurrentValue ) {
        ret[ ret.length ] = value;
        if ( stop ) {
            callback.apply( null, returnCurrentValue ? [value] : ret.slice(1) );
            return;
        }
        queue( (old.shift(), old ), fn, callback, ret );
    };

    if ( length > 0 ) {
        var argus = [ old[0], ret[0] - length, ret.slice(1) ];
        if ( fn.length ) {
            argus = argus.slice( 0, fn.length - 1 );
        }
        argus.push( next );
        fn.apply( null, argus );
    }
    else if ( callback && ret.shift() === ret.length ) {
        callback.apply( null, ret );
    }
}

// 同步.
// 不存在依赖关系, 可同时执行, 最后返回结果.
// ex:
// * 类似 jQuery 中的 when.
function sync( list, fn, callback ) {
    var n = list.length;
    var times = 0;
    var ret = [];
    var wrapper = function () {
        if ( times === n && callback ) {
            callback.apply( null, ret );
        }
    };
    var done = function ( index ) {
        return function ( result, stoped ) {
            if ( stoped ) {
                callback.call( null, result );
                return;
            }
            times++;
            ret[index] = result;
            wrapper();
        };
    };
    if ( n === 0 ) {
        wrapper();
        return;
    }
    var i = 0;
    var item;
    while ( i < n ) {
        item = list[ i ];
        var argus = [ item, i, ret ];
        var cb = done( i );
        if ( fn.length ) argus = argus.slice( 0, fn.length - 1 );
        argus[argus.length] = cb;
        fn.apply( null, argus );
        i++;
    }
}

