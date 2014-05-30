var elements = $( '.demo' );

function reset() {
  elements.stop( true );
  elements.css( 'left', 0 );
}

function action( fn ) {
  if ( fn ) {
    reset();
    fn.call( null, elements.toArray(), function( element, done ) {
      $( element ).animate({left: '80%'}, 500, done);
    });  
  }
}

function go(id) {
  switch(String(id).toLowerCase()) {
    case 'queue':
      action( queue ); break;
    case 'queuepromise':
      action( queuePromise ); break;
    case 'queueyield':
      action( queueYield ); break;
    default:
      alert( 'Don\'t support!' ); break;
  }  
}

$( document ).on( 'click', 'button', function(e) {
  var id = e.target.id;
  if ( id === 'reset' ) reset();
  else go(e.target.id);
});

$( document ).keydown(function(e) {
  if ( e.ctrlKey && e.which === 82 ) {
     go(prompt('Input method:'));
  }
});

