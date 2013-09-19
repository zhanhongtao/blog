function create( func, check, time ) {
  var flag = false;
  var hasDone = false;
  var done = function( array ) {
    func.apply( this, array );
    hasDone = true;
    if ( time == null ) {
      reset();
    }
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
  return {
    on: function() {
      if ( !flag && check.apply(this, arguments) ) {
        flag = true;
        if ( typeof time == 'number' && time > 0 )
          setTimeout( reset, time * 1000 );
      }
      return this;
    },
    off: function( callback ) {
      if ( hasDone || time == null ) {
        if ( typeof callback == 'function' ) {
          callback();
        }
      }
      reset();
      return this;
    },
    done: function() {
      if ( flag && !hasDone ) {
        done( [].slice.call(arguments) );
      }
      return this;
    }
  };
}