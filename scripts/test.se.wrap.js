

;(function() {

  var f = function() {
    return 1;
  };

  var before = function( callback ) {
    if ( typeof callback == 'function' ) {
      callback();
    }
    return 'before';
  };

  var after = function( callback ) {
    if ( typeof callback === 'function' ) {
      callback();
    }
    return 'after';
  };

  var f_before = se.wrap( f, function( next ) {
    var ret = before();
    next();
    return ret;
  });
  test( f_before() === 'before', 'wrap before' );

  var f_before_return = se.wrap( f, function( next ) {
    before();
    var ret = next();
    return ret;
  });
  test( f_before_return() === 1, 'wrap before return' );

  // 异步测试.
  // 超时
  // 存在返回值.
  var f_before_sync = se.wrap( f, function( next ) {
    return before(function() {
      var ret = next();
      test( ret === 1, 'wrap before sync return' );
    });
  });

  test( f_before_sync() === 'before', 'wrap before sync & return' );

})();