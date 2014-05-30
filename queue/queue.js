
function queue( list, fn, callback, index, ret ) {
  "use strict";
  index = index || 0;
  ret = ret || [];
  var next = function ( value, stop, returnCurrentValue ) {
    ret[ ret.length ] = value;
    if ( stop ) {
      return callback.apply( null, returnCurrentValue ? [value] : ret );
    }
    queue( list, fn, callback, ++index, ret );
  };
  if ( index < list.length ) {
    var argus = [ list[ index ], index, ret ];
    if ( fn.length ) {
      argus = argus.slice( 0, fn.length - 1 );
    }
    argus.push( next );
    fn.apply( null, argus );
  }
  else if ( callback ) {
    callback.apply( null, ret );
  }
}

