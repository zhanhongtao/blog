

;(function() {

  var array = {};
  array.max = function( array ) {
    return Math.max.apply( Math, array );
  };

  array.min = function( array ) {
    return Math.min.apply( Math, array );
  };

  se.mixin( array );

  var s = se( [1, 3, 4, 6] );

  console.assert( s.max() === 6 );
  console.assert( s.min() === 1 );

})();