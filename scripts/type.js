function type( s ) {
  return Object.prototype.toString.call( s ).toLowerCase().slice( 8, -1 );
}