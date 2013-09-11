// 指定时间内仅执行一次.
function throttle( func, wait ) {
  var timer;
  var previous = 0;
  var args;
  var context;
  var later = function() {
    previous = new Date;
    func.apply( context, args );
  };
  var ret = function() {
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
  return ret;
}