function throttle( func, wait ) {
  var previous;
  var timer;
  var args;
  var context;
  var later = function() {
    previous = new Date;
    func.apply( context, args );
  };
  var ret = function() {
    args = arguments;
    context = this;
    var now = new Date;
    var remaining = wait - ( now - previous );
    if ( remaining <= 0 ) {
      clearTimeout( timer );
      func.apply( context, args );
      timer = null;
      previous = now;
    }
    else if ( !timer ) {
      timer = setTimeout( later, remaining );
    }
    return ret;
  };
  return ret;
}