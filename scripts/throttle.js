// 指定时间内仅执行一次.
// ex: 100ms 执行一次, 那么 1s 里 10 次.
// ctrl + s.
// search - 即时搜索. 上次还没完成, 这次又发送请求, 可以执行 abort 上次请求.
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
    var remaining = wait - now + previous;
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