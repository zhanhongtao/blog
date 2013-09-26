

;(function() {
  var array = [ 1, [2], [3,[4]], 5];
  var result = se.flat( array );
  console.assert( result.join('-') == '1-2-3-4-5', 'test flat array' );
})();

