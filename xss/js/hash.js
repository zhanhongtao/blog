// 支持 hash 更新.
// 支持 history 更新.
;(function() {
  var eventemitter = eventEmitter();
  
  function updateHash( message ) {
    // 如果已经是 hash 触发的事件,
    // 就不再 pushState.
    if ( message.from === 'hash' ) return;
    // 修正 ie 不支持 pushState 问题.
    if ( history.pushState ) {
      var uri = '';
      var page = message.page || 0;
      var sub  = message.sub == null ? '' : '/' + message.sub;
      var href = location.href;
      if ( href.indexOf('#') === -1 ) {
        uri = href + '#' + page + sub;
      }
      else {
        uri = href.replace( /#([^&]*)/i, function () {
          var uri = '#' + page + sub;
          return uri;
        });
      }
      if ( uri !== location.href ) {
        setTimeout(function() {
          history.pushState( {}, document.title, uri );
        }, 50);        
      }
    }    
  }

  eventemitter.on( 'on-page-changed', updateHash );
  eventemitter.on( 'on-sub-slide-changed', updateHash );

})();

