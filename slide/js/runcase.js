

;(function() {
  var cloest = function ( element, target ) {
      while ( element && element.nodeType === 1 ) {
          if ( element.webkitMatchesSelector(target) ) {
              return element;
          }
          element = element.parentNode;
      }
      return null;
  };

  var runcode = function( code ) {
    var fixCode = '(function() {' + code + '})();';
    var f = new Function( 'return ' + fixCode );
    f();
  };

  var displayRunButton = function( display, target ) {
    var runcase = target.querySelector( '.runcase' );
    if ( runcase ) {
      runcase.style.display = display ? 'block' : 'none';
    }
  };

  var runcases = document.querySelectorAll('.codebox');

  for ( var i = 0, l = runcases.length; i < l; i++ ) {
    var codebox = runcases[i];
    codebox.addEventListener( 'mouseover', function( event ) {
      displayRunButton( true, this );
    }, false );
    codebox.addEventListener( 'mouseout', function( event ) {
      displayRunButton( false, this );
    }, false );
  }

  document.addEventListener( 'click', function( event ) {
    var target = event.target;
    if ( target.webkitMatchesSelector( '.runcase' ) ) {
      var codebox = cloest(target, '.codebox');
      var pre = codebox.querySelector( 'pre' );
      if ( pre ) {
        runcode( pre.innerText );
      }
    }
  }, false );

})();

