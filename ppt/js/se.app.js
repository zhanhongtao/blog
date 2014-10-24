se.filterToggle = function( list ) {
  var array = Array.prototype.slice.call( list );
  return array.filter(function( dom ) {
    return !dom.classList.contains( 'toggle' );
  });
};
