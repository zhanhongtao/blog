function simple( dur, easetype, callback ) {
  var t = new Date;
  ;(function repeat() {
    var c = new Date;
    var p = ease[ easetype ]( Math.min(1.0, (c-t)/dur) );
    callback(p);
    if ( p < 1.0 ) {
      requestAnimationFrame( arguments.callee );
    }
  })();
}