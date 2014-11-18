var code = $( '#code' ), result = $( '#result' );
var escaper = /\\|'|"|\r|\n|\u2028|\u2029/g;

$( '#head' ).on( 'click', 'button', function(e) {
  var id = this.id;
  var string = code.val().replace( escaper, '\\$&' );
  var setting = {};
  if ( id === 'decode' ) {
    setting = {
      base: this.dataset.base,
      left: this.dataset.left,
      right: this.dataset.right
    };
    var ret = decode( string, setting );
  }
  else {    
    eval( 'var ret = ' + id + '("' + string + '")' );    
  }
  result.val( ret );
  return false;
});

function change() {
  var t = code.val();
  code.val( result.val() );
  result.val( t );
}

$( document ).on( 'keydown', function(e) {
  if ( e.altKey && e.which === 67 ) {
    change();
  }
});