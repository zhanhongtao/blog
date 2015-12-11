function sync( list, fn, callback, tag ) {
  var n = list.length;
  var times = 0;
  var ret = [];
  var current = 0;
  var wrapper = function () {
    if ( times === n && callback ) {
      callback.apply( null, ret );
    }
  };

  var checkDoneList = function ( list, results ) {
    var ret = [];
    var i = 0;
    while ( 1 ) {
      if ( list[i] === -1 ) {
        i++;
      }
      else if ( list[i] === i ) {
        ret.push( results[i] );
        list[ i ] = -1;
      }
      else {
        break;
      }
    }
    return ret;
  };

  var createDone = function( func ) {
    var donelist = [];
    return function( index ) {
      return func.call( null, index, donelist );
    };
  };

  var done = createDone(function( index, donelist ) {
    return function( result ) {
      times++;
      ret[ index ] = result;
      donelist[ index ] = index;
      if ( tag === true || tag === 1 ) {
        var list = checkDoneList( donelist, ret );
        if ( list.length ) callback.apply( null, list );
      }
      else if ( tag === 2 ) {
        callback.call( null, {index: index, data: result});
      }
      else {
        wrapper();
      }
    };
  });

  if ( n === 0 ) {
    wrapper();
    return;
  }
  var i = 0;
  var item;
  while ( i < n ) {
    item = list[ i ];
    var argus = [ item, i, ret ];
    var cb = done( i );
    if ( fn.length ) argus = argus.slice( 0, fn.length - 1 );
    argus[argus.length] = cb;
    fn.apply( null, argus );
    i++;
  }
};
