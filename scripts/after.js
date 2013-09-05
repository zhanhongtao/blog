// 调用多少次后, 再执行函数.
// ex:
// 多个键做入口.
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