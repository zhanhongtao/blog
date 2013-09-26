

;(function() {
  var start = new Date;
  var func = se.delay(function() {
    var result = ( new Date ) - start;
    console.assert( result - 1000 >= 0, 'test delay' );
  }, 1);
  func();

  var func2 = se.delay(function() {
    console.assert( 0, 'test delay cancel' );
  }, 2);

  func2();
  func2.cancel();

})();

