function queueYield( list, handler, callback ) {
  function *_queue( n ) {
    var i = 0;
    while (1) {
      if ( i === n ) return;
      yield i++;
    }
  }
  var q = _queue( list.length ), ret = [], length = handler.length, callback = callback || function() {};
  var next = function() {
    var result = q.next();
    if ( result && result.done === false ) {
      var index = result.value, args = [ list[index], index, ret ];
      var done = function( returnValue, stop, onlyReturnValue ) {
        ret.push( returnValue );
        if ( stop ) {
          return callback.apply( null, onlyReturnValue ? [ returnValue ] : ret );
        }
        next();
      };
      if ( length < 4 ) args = args.slice( 0, length - 1 );
      args.push( done );
      handler.apply( null, args );
    }
    else {
      callback.apply( null, ret );
    }
  };
  next();
}
