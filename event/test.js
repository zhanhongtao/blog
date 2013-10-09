

var EventEmitter = require( './eventEmitter.js' );

function test( name ) {
  var ee = EventEmitter( name || '' );
  var result = [];
  var methods = 'abcdef'.split('');
  methods.forEach(function( name ) {
    this[ name ] = function() {
      result.push( name );
    };
  });
  ee.bind( ['a', 'b'], a, b, c, [ d, e , [f]] );
  ee.emit( 'a' );
  console.assert( result.join('') === 'abcdef' );  
}

test( 'test-argumetns' );

