

function bind( func, context ) {
  return function() {
    return func.apply( context || this, arguments );
  }
}

function type( s ) {
  return Object.prototype.toString.call(s).slice(8, -1).toLowerCase();
}

function flatArray( array ) {
  var i = 0, l = array.length, result = [], current;
  for ( ; i < l; i++ ) {
    current = array[i];
    result = result.concat( current instanceof Array ? flatArray(current) : current );
  }
  return result;
}

function partial( func ) {
  var argus = [].slice.call( arguments, 1 );
  return function() {
    return func.apply( this, argus.concat([].slice.call(arguments)) );
  };
}

function once( func ) {
  var flag, result;
  return function() {
    if ( flag ) return result;
    flag = true;
    result = func.apply( this, arguments );
    return result;
  };
}

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
