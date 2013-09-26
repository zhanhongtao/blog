

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

  testcases.add( 'test before', function( next ) {
    var ret = before();
    test( ret === 'before', 'test before function' );
    next();
  });

  testcases.add( 'test before', function( next ) {
    before(function() {
      test( true, 'test before async function' );
      next();
    });
  });

  var after = function( callback ) {
    if ( typeof callback === 'function' ) {
      callback();
    }
    return 'after';
  };

  testcases.add( 'test after', function( next ) {
    var ret = after();
    test( ret === 'after', 'test after function' );
    next();
  });

  testcases.add( 'test after', function( next ) {
    after(function() {
      test( true, 'test after async function' );
      next();
    });
  });

  var f_before = se.wrap( f, function( next ) {
    var ret = before();
    next();
    return ret;
  });

  testcases.add( 'test wrap - before', function( next ) {
    test( f_before() === 'before', 'wrap before' );
    next();
  });

  var f_before_return = se.wrap( f, function( next ) {
    before();
    var ret = next();
    return ret;
  });

  testcases.add( 'test wrap - before & return', function( next ) {
    test( f_before_return() === 1, 'wrap before return' );
    next();
  });

  // 异步测试.
  // 超时
  // 存在返回值.
  var f_before_sync = se.wrap( f, function( next ) {
    // before 的回调一定会执行 -> 前提.
    return before(function() {
      var ret = next();
      test( ret === 1, 'wrap before sync return' );
    });
  });

  testcases.add( 'test wrap before-sync', function( next ) {
    test( f_before_sync() === 'before', 'wrap before sync & return' );
    next();
  });

  testcases.start(function() {
    console.log( arguments );
  });

})();