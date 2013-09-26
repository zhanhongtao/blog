

;(function() {

  var array = [1,2,3,4,5];
  se.sync( array, function( item, index, ret, done ) {
    setTimeout(function() {
      done( item );
    }, index * 100 );
  }, function() {
    var argus = [].slice.call( arguments );
    console.assert( argus.join() == '1,2,3,4,5', 'test sync' );
  });

  var list = [], length = array.length;
  se.sync( array, function( item, index, done ) {
    setTimeout(function() {
      done( item );
    }, Math.random() * 1000 );
  }, function() {
    var argus = [].slice.call( arguments );
    list = list.concat( argus );
    if ( list.length === array.length ) {
      console.assert( list.join() === array.join(), 'test sync 1' );
    }
  }, true);

})();

