

// 支持 hash 更新.
// 支持 history 更新.
;(function() {
  var eventemitter = eventEmitter();

  window.addEventListener( 'hashchange', function( event ) {
    var hash = location.hash;
    if ( hash ) {
      eventemitter.emit( 'on-update-page', ~~hash.slice(1), 'hash' );
    }
  }, false );

  eventemitter.on( 'on-page-changed', function( message ) {
    // 如果已经是 hash 触发的事件,
    // 就不再 pushState.
    if ( message.from === 'hash' ) return;

    // 修正 ie 不支持 pushState 问题.
    if ( history.pushState ) {
      var uri = '';
      var page = message.page;
      var href = location.href;
      if ( href.indexOf('#') === -1 ) {
        uri = href + '#' + page;
      }
      else {
        uri = href.replace( /#([^&]*)/i, function () {
          return '#' + page;
        });
      }

      history.pushState( {}, document.title, uri );
    }

  });

})();

