// 仅执行一次函数.
// ex:
// * 修正重复绑定事件.
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