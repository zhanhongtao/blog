// 仅执行一次函数.
// ex:
// * 修正重复绑定事件.
// http://zhanhongtao.github.com/blog/html/once.html
// @note: 实例并不能说明问题, 不同匿名函数不算重复绑定.
function once( func ) {
  var result;
  var tag = false;
  return function() {
    if ( tag ) return result;
    tag = true;
    result = func.apply( this, arguments );
    return result;
  };
}