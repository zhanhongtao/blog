

;(function() {

  var n = 0;
  var func = se.after( 3, function() {
    n++;
  });

  var i = 0;
  while ( i < 10 ) {
    func();
    i++
  }

  console.assert( n === 3, 'test after' );

})();

