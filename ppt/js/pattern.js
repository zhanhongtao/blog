
;(function() {

  var ee = eventEmitter();
  var body = document.querySelector( 'body' );
  var slides = document.querySelectorAll( '.slide:not(.toggle)' );
  var pages = slides.length;

  function onPatternChanged( page, pattern ) {
    if ( pattern == null ) {
      pattern = localStorage.pattern === 'ppt' ? '' : 'ppt';
    }
    localStorage.pattern = pattern;
    body.classList[ pattern === 'ppt' ? 'add' : 'remove' ]( 'ppt' );
    slides[page].scrollIntoView();
  }

  ee.on( 'on-page-pattern-changed', onPatternChanged );

})();
