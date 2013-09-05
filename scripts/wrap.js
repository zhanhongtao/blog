// 函数包装 - 类 aop.
// 支持函数返回和函数参数缺省
// ex:
// * 验证
// * 统计
// * 修正参数
// ex: http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/
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

