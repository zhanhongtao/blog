
var source = document.getElementById( 'source' );
var pasteBox = document.getElementById( 'paste' );
var btnCopy = document.getElementById( 'copy' );
var btnClear = document.getElementById( 'clear' );

var client = new ZeroClipboard( btnCopy, { moviePath: "./swf/ZeroClipboard.swf" } );

client.on( 'load', function( client ) {
  client.on( 'mousedown', function(){
    var text = source.value;
    if ( text.length > 0 ) {
      client.setText( text );
    }
  });
  client.on( 'complete', function( client, args ) {
    console.log( 'complete:', args );
  });
});

btnClear.onclick = function() {
 pasteBox.value = ''; 
};

