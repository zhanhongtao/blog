

;(function() {
  var n = 0;
  var i = 0;
  var d = 10;
  var once2 = se.once(function() {
    return ++n;
  });
  while ( i < d ) {
    once2();
    i++;
  }
  console.assert( n === 1, 'test once' );
})();

