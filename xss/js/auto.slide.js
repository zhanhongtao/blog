

;(function() {
  var wait = 1 * 1000;
  var ee = eventEmitter();
  var timer;
  var auto = false;
  var cleartimeout = function() {
      clearTimeout( timer );
      timer = null;
  };

  function autoSlide() {
    if ( timer ) {
      cleartimeout();
    }
    timer = setTimeout(function() {
      ee.emit( 'ppt-next' );
      autoSlide();
    }, wait );
  }

  ee.on( 'on-page-changed', function( message ) {
    if ( message.page === message.pages ) {
      cleartimeout();
    }
    else if ( auto ) {
      autoSlide();
    }
  });

  // alt + s
  document.addEventListener( 'keydown', function( event ) {
    var code = event.keyCode;
    if ( code === 83 && event.altKey ) {
      if ( auto ) {
        clearTimeout( timer );
      }
      auto = !auto;
      if ( auto ) {
        autoSlide();
      }
    }
  });

})();

