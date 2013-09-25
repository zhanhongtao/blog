

;(function() {
  var eventemitter = eventEmitter();
  var ua = navigator.userAgent;
  if ( !ua || ua.toLowerCase().indexOf( 'ipad' ) == -1 ) {
    return;
  }

  if ( 'ontouchstart' in window ) {
    eventemitter.emit( 'change-pattern', 'ppt' );
  }

  var startX = 0;
  var startY = 0;
  var ontouchstart = function( event ) {
    var touches = event.touches;
    if ( touches.length === 1 ) {
      var touch = touches[0];
      startX = event.changedTouches[0].pageX;
      startY = event.changedTouches[0].pageY;
      document.addEventListener( 'touchend', ontouchend, false );
    }
  };
  var ontouchend = function( event ) {
    console.log( 'touchend: ', event );
    if ( event.touches.length === 0 ) {
      var x = event.changedTouches[0].pageX;
      var y = event.changedTouches[0].pageY;
      console.log( Math.abs(startX-x) );
      if ( Math.abs( startX - x ) < 50 ) return;
      if ( Math.abs( (startY-y)/(startX-x) ) > 1 ) return;

      eventemitter.emit( startX - x < 0 ? 'ppt-prev' : 'ppt-next' );
      document.removeEventListener( 'touchend', ontouchend );
    }
  };

  document.addEventListener( 'touchstart', ontouchstart, false );
  document.addEventListener( 'touchmove', function( event ) {}, false );
  document.addEventListener( 'touchcancel', function( event ) {}, false );
  document.addEventListener( 'gesturestart', function( event ) {}, false );
  document.addEventListener( 'gesturechange', function( event ) {}, false );
  document.addEventListener( 'gestureend', function( event ) {}, false );
})();

