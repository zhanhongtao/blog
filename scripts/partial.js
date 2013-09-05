

function partial( func ) {
  var args = [].slice.call( arguments, 1 );
  return function() {
    var argus = [].slice.call( arguments );
    return func.apply( this, args.concat( argus ) );
  };
}

