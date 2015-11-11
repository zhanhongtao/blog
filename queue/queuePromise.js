function queuePromise( list, handler, callback ) {
  var promise = Promise.resolve([]), length = handler.length, cb = callback || function() {};
  list.forEach(function( value, index ) {
    promise = promise.then(function( ret ) {
      return new Promise(function( resolve, reject ) {
        var next = function( returnValue, stop, onlyReturnValue ) {
          ret.push( returnValue );
          if ( stop ) {
            return cb.apply( promise = null, onlyReturnValue ? [returnValue] : ret );
          }
          resolve( ret );
        };
        var argus = [ value, index, ret ];
        if ( length < 4 ) argus = argus.slice( 0, length -1 );
        argus.push( next );
        handler.apply( null, argus );
      });
    });
  });
  promise.then(function( result ) {
    cb.apply( null, result );
  });
}

/*
  var promise = new Promise(function( resolve, reject ) {});
  Promise.resolve( value );
  Promise.reject( reason );
  Promise.all( promiseList );
  Promise.race( promiseList );
  promise.then( onFulfilled, onRejected );
  promise.catch( onRejected );
*/
