// 预置参数.
// 仅向最新预置.
// 参考: http://benalman.com/news/2012/09/partial-application-in-javascript/
function partial( func ) {
  var args = [].slice.call( arguments, 1 );
  return function() {
    var argus = [].slice.call( arguments );
    return func.apply( this, args.concat( argus ) );
  };
}

