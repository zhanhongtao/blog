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
      var id = message.id || message.page || 0;
      var href = location.href;
      var hashIndex = href.indexOf('#');
      if ( hashIndex === -1 ) {
        uri = href + '#' + id;
      } else {
        var b = href.slice(0, hashIndex + 1);
        var c = id;
        var hash = href.slice( hashIndex);
        var l = hash.replace( /#(?:&|[^=&]*(?:=|&|=&|$))/, '');
        uri = b + c + (l ? '&' + l : '');
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

