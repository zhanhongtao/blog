
;(function() {
  var ee = eventEmitter();
  var body = document.querySelector( 'body' );
  var slides = document.querySelectorAll( '.slide' );
  var pages = slides.length;

  function onPatternChanged( page ) {
    body.classList.toggle( 'ppt' );
    slides[page].scrollIntoView();
    var pattern = body.classList.contains( 'ppt' );
    localStorage.pattern = pattern ? 'ppt' : '';
    if ( pattern ) {
      return ee.emit( 'on-resize' );
    }
    ;(function() {
      var i = 0;
      while ( i < pages ) {
        var slide = slides[i];
        slide.style.webkitTransform = 'scale(1)';
        slide.style.MozTransform = 'scale(1)';
        slide.style.msTransform = 'scale(1)';
        slide.style.oTransform = 'scale(1)';
        i++;
      }
    })();
  }

  ee.on( 'on-page-pattern-changed', onPatternChanged );
  ee.on( 'ppt-init', function( page ) {
    var pattern = localStorage.pattern;
    console.log( pattern );
    if ( pattern === 'ppt' && !body.classList.contains('ppt') ) {
      onPatternChanged( page );
    }
  });

})();
