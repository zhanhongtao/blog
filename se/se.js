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
})( 'se', function() {

  var root = this;
  var previousSe = this.se;

  var se = function( value ) {
    if ( value instanceof se ) return value;
    if ( !(this instanceof se) ) return new se( value );
    this.core = value;
  };

  se.noConflict = function() {
    root.se = previousSe;
    return this;
  };

  var result = function( obj ) {
    return this._chain ? se( obj ).chain() : obj;
  };

  se.chain = function( value ) {
    return new se( value ).chain();
  };

  var type = se.type = function( s ) {
    return Object.prototype.toString.call( s ).slice( 8, -1 ).toLowerCase();
  };

  var toArray = se.toArray = function( argus, index ) {
    return [].slice.call( argus, index );
  };

  se.each = function( obj, iterator, context ) {
    var otype = type( obj );
    if ( otype === 'array' ) {
      if ( obj.forEach ) {
        obj.forEach(iterator);
      }
      else {
        for ( var i = 0, l = obj.length; i < l; i++ ) {
          iterator.call( context, obj[i], i, obj );
        }
      }
    }
    else {
      for ( var i in obj ) {
        if ( obj.hasOwnProperty(i) ) {
          iterator.call( context, obj[i], i );
        }
      }
    }
  };

  se.flat = function flat( array ) {
    var i = 0, l = array.length, result = [], current;
    for ( ; i < l; i++ ) {
      current = array[i];
      result = result.concat( current instanceof Array ? flat(current) : current );
    }
    return result;
  };

  se.reduce = Array.prototype.reduce || function( array, f, base ) {
    var length = array.length;
    var i = 0;
    var ret = base == null ? (i++, array[0]) : base;
    for ( ; i < length; i++ ) {
      ret = f( ret, array[i], i );
    }
    return ret;
  };

  se.reduceRight = Array.prototype.reduceRight || function( array, f, base ) {
    var length = array.length;
    var ret = base == null ? (length--, array[length]) : base;
    while ( length-- ) {
      ret = f( ret, array[length], length );
    }
    return ret;
  };

  se.zip = function zip( x, y, f ) {
    f = typeof f === 'function' ? f : function ( a, b ) {
      return [ a, b ];
    };
    var xl = x.length;
    var yl = y.length; 
    var i = xl > yl ? yl : xl;
    var ret = [];
    while (i--) ret[i] = f( x[i], y[i] );
    return ret;
  };

  se.extend = function extend( base ) {
    base = type(base) === 'object' ? base : {};
    var argus = se.toArray( arguments, 1 );
    for ( var i = 0, l = argus.length; i < l; i++ ) {
      var others = argus[i];
      if ( type(others) !== 'object' ) continue;
      for ( var key in others ) {
        if ( type(others[key]) === 'object' ) {
          base[key] = base[key] || {};
          extend( base[key], others[key] );
        }
        // @TODO:
        // 目前只做一层合作.
        // 可尝试深度合并...
        else if ( type(others[key]) === 'array' ) {
          base[key] = base[key] || [];
          base[key] = base[key].concat( others[key] );
        }
        else {
          base[key] = others[key];
        }
      }
    }
    return base;
  };

  se.bind = function( f, context ) {
    return Function.prototype.bind ? f.bind(context) : function() {
      return f.apply( context || this, arguments );
    };
  };

  se.partial = function( func ) {
    var argus = [].slice.call( arguments, 1 );
    return function() {
      return func.apply( this, argus.concat([].slice.call(arguments)) );
    };
  };

  se.compose = function() {
    var methods = [].slice.call(arguments);
    return function() {
      var ret = methods[0].apply( this, arguments );
      for ( var i = 1, l = methods.length; i < l; i++ ) {
        ret = methods[i].call( this, ret );
      }
      return ret;
    };
  };

/**
  se.compose = function() {
    var methods = [].slice.call(arguments);
    return function() {
      var argus = arguments;
      return se.reduce( methods, function( base, item, index ) {
        return item.call( this, index === 0 ? argus : base );
      });
    };
  };
*/

  se.once = function( func ) {
    var flag, result;
    return function() {
      if ( flag ) return result;
      flag = true;
      result = func.apply( this, arguments );
      return result;
    };
  };

  se.wrap = function( self, func ) {
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
  };

  se.debounce = function ( func, wait ) {
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
  };

  se.throttle = function ( func, wait ) {
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
  };

  se.after = function( count, func ) {
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
  };

  // 队列
  se.queue = function( list, fn, callback, ret ) {
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
          se.queue( (old.shift(), old ), fn, callback, ret );
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
  };

  // 同步, 提前把结果抛出.
  se.sync = function( list, fn, callback, tag ) {
    var n = list.length;
    var times = 0;
    var ret = [];
    var current = 0;
    var wrapper = function () {
        if ( times === n && callback ) {
            callback.apply( null, ret );
        }
    };

    var checkDoneList = function ( list, results ) {
      var ret = [];
      var i = 0;
      while ( 1 ) {
          if ( list[i] === -1 ) {
              i++;
          }
          else if ( list[i] === i ) {
              ret.push( results[i] );
              list[ i ] = -1;
          }
          else {
              break;
          }
      }
      return ret;
    };

    var createDone = function( func ) {
        var donelist = [];
        return function( index ) {
            return func.call( null, index, donelist );
        };
    };

    var done = createDone(function( index, donelist ) {
        return function( result ) {
            times++;
            ret[ index ] = result;
            donelist[ index ] = index;
            if ( tag === true || tag === 1 ) {
              var list = checkDoneList( donelist, ret );
              if ( list.length ) callback.apply( null, list );
            }
            else if ( tag === 2 ) {
              callback.call( null, {index: index, data: result});
            }
            else {
              wrapper();
            }
        };
    });

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
  };

  se.create = function( func, check, time ) {
    var flag = false;
    var hasDone = false;
    var done = function( array ) {
      func.apply( this, array );
      hasDone = true;
    };
    var reset = function() {
      flag = hasDone = false;
    };
    if ( typeof check != 'function' ) {
      var old = check;
      check = function () {
        return !!old;
      };
    }
    function timeout() {
      if ( typeof time == 'number' && time > 0 ) {
        setTimeout( reset, time * 1000 );
      }
    }
    return {
      on: function() {
        if ( !flag && check.apply(this, arguments) ) {
          flag = true;
          timeout();
        }
        return this;
      },
      off: function( callback ) {
        if ( hasDone || (typeof time != 'number' || time <= 0 ) ) {
          if ( typeof callback == 'function' ) {
            callback();
          }
        }
        reset();
        return this;
      },
      done: function() {
        if ( flag ) {
          if ( !hasDone ) {
            done( [].slice.call(arguments) );
          }
        }
        return this;
      },
      state: function() {
        return {
          flag: flag,
          done: hasDone
        };
      }
    };
  };

  se.delay = function ( func, wait ) {
    var timer;
    wait = wait == null ? 0 : wait;
    var ret = function() {
      var self = this;
      var argus = arguments;
      timer = setTimeout(function() {
        func.apply( self, argus );
      }, wait * 1000 );
    };
    ret.cancel = function() {
      if ( timer ) {
        clearTimeout( timer );
        timer = null;
      }
    };
    return ret;
  };

  se.identity = function( value ) {
    return value;
  };

  se.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = se.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return memo[key] ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  se.mixin = function( obj ) {
    se.each( obj, function( func, method ) {
      se.prototype[ method ] = function() {
        var argus = [ this.core ];
        [].push.apply( argus, arguments );
        return result.call( this, func.apply( this, argus ) );
      };
    });
  };

  se.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  se.prototype.value = function() {
    return this.core;
  };

  return se;
});

