

console.log( 'background.js' );

chrome.runtime.onMessage.addListener(function(message, request, response) {
  console.log( 'bg: ', arguments );
  if ( message && message.cmd == 'send-links-count' ) {
    console.log( 'log: message: ', message );
    response( 'OK' );
  }
});


// 给 tabid 发消息.
// chrome.tabs.sendMessage( tabid, message, callback );
