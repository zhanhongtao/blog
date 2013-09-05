// 调用多少次后, 再执行函数.
// ex: http://zhanhongtao.github.io/blog/html/after.html
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

