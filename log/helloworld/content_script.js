

var links = document.querySelectorAll( 'a' );

// content_script => background
chrome.runtime.sendMessage({
  cmd: 'send-links-count',
  data: links.length
}, function( message ) {
  console.log( 'response: ', message );
});


chrome.runtime.onMessage.addListener(function( message, request, response ) {
  if ( message.cmd == 'alert' ) {
    alert( message.data );
    response( 'End' );
  }
});
