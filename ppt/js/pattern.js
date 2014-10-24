
;(function() {

  var ee = eventEmitter();
  var body = document.querySelector( 'body' );
  var slides = document.querySelectorAll( '.slide' );
  slides = se.filterToggle( slides );
  var pages = slides.length;

  function onPatternChanged( page, pattern ) {
    if ( pattern == null ) {
      pattern = localStorage.pattern === 'ppt' ? '' : 'ppt';
    }
    localStorage.pattern = pattern;
    body.classList[ pattern === 'ppt' ? 'add' : 'remove' ]( 'ppt' );
    slides[page].scrollIntoView();
    ee.emit( pattern === 'ppt' ? 'on-resize' : 'on-resize-to', 1 );
  }

  ee.on( 'on-page-pattern-changed', onPatternChanged );
  ee.on( 'ppt-init', function( page ) {
    // @todo: 做自适应处理.
    return;
    var pattern = localStorage.pattern;
    onPatternChanged( page, pattern ? 'ppt' : '' );
  });

})();
