
function fill( length, value ) {
  var i = 0, r = [];
	while ( i < length ) {
	  r.push( value );
	}
	return r;
}

// helper
function type( n ) {
  return Object.prototype.toString.call( n ).slice( 8, -1 ).toLowerCase();
}

function swap( array, i, j ) {
  if ( i == j )return;
  var t = array[i];
  array[i] = array[j];
  array[j] = t;
}

function fill( n, value ) {
  var ret = [];
  while ( n-- ) {
    ret.push( value );
  }
  return ret;
}

function flatten( array ) {
  var i = 0, l = array.length, ret = [];
  for ( ; i < l; ++i ) {
    var c = array[i];
    if ( type(c) == 'array' ) {
      [].push.apply( ret, flatten(c) );
    } else {
      ret.push( c );
    }
  }
  return ret;
}

function reverse( array ) {
  var i = 0, l = array.length;
  for ( var i = 0, j = array.length - 1; i < j; ++i, --j ) {
    if ( i < j ) {
      swap( array, i, j );
    }
  }
}

function max() {
  return Math.max.apply( Math, flatten(arguments) );
}

function min( array ) {
  return Math.min.apply( Math, flatten(arguments) );
}

function getRandomTop( array, n ) {
  var ret = [], l = array.length;
  while ( n-- ) {
    var i = Math.floor( Math.random() * l );
    swap( array, i, --l );
    ret.push( array[l] );
  }
  return ret;
}

function shuffle( array ) {
  for ( var i = 0, l = array.length, rand; i < l; ++i ) {
    rand = Math.floor( Math.random() * i );
    if ( rand != i ) swap( array, rand, i );
  }
}

