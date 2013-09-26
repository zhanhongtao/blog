

;(function() {

  var array = {};
  array.max = function( array ) {
    return Math.max.apply( Math, array );
  };

  array.map = function( array, func ) {
    var ret = [];
    for ( var i = 0, l = array.length; i < l; i++ ) {
      ret.push( func.call(this, array[i], i, array) )
    }
    return ret;
  };

  se.mixin( array );

  var s = se( [1, 3, 4, 6] );

  var max = s.max();
  console.assert( max === 6, 'test mixin - max' );

  var smap = s.map(function( item ) {
    return item * 2;
  });

  console.assert( smap.join() === '2,6,8,12', 'test mixin - map' );

})();

