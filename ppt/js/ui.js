;(function() {
  var selector = /[?&#]v=1/i.test( location.href ) ? '.slide' : '.slide:not(.toggle)';
  var slides = document.querySelectorAll( selector );
  var TARGET_CLASS = 'target';
  var TARGET_FROM_DIRECTION_PREV_CLASS = 'prev';
  var TARGET_FROM_DIRECTION_NEXT_CLASS = 'next';
  var nav = document.querySelector( '#navigator' );

  var updateui = function( message ) {
    var page = message.page;
    var pages = message.pages;

    // 隐藏 page.
    var old = document.querySelector( '.' + TARGET_CLASS );
    if ( old ) {
      old.classList.remove( TARGET_CLASS );
    }

    [ TARGET_CLASS, TARGET_FROM_DIRECTION_NEXT_CLASS, TARGET_FROM_DIRECTION_PREV_CLASS ].forEach(function( className ) {
      try {
        document.querySelector( '.' + className ).classList.remove( className );
      } catch(e) {}
    });

    var target = slides[ page ];
    target.classList.add( TARGET_CLASS );
    if ( page != message.prev )
      slides[ message.prev ].classList.add( TARGET_FROM_DIRECTION_PREV_CLASS );
    if ( page != message.next )
    slides[ message.next ].classList.add( TARGET_FROM_DIRECTION_NEXT_CLASS );

    // 让元素可见.
    target.scrollTop = 0;
    // @todo: 查找第一个可拿到焦点的元素.
    target.focus();

    // 检查背景.
    var dataset = target.dataset;
    [ 'color', 'image', 'repeat', 'position', 'size', 'repeat' ].forEach(function( key ) {
      if ( dataset[key] ) {
        var value = dataset[key];
        if ( key == 'image' ) {
          value = 'url(' + value + ')';
        }
        target.style[ 'background-' + key ] = value;
      }
    });

    // 更新 title.
    if ( dataset.title ) {
      document.title = dataset.title;
    } else {
      var h1 = target.querySelector( 'h1' );
      if ( h1 ) {
        eventemitter.emit( 'innerText', h1, function( title ) {
          document.title = title;
        });
      }
    }

    // 更新进度条.
    nav.style.width = ( (page+1) / pages ) * 100 + '%';

  };

  var eventemitter = eventEmitter();
  eventemitter.on( 'on-page-changed', function( message ) {
    updateui( message );
  });
  
  // 移除 pre 内 code 前面换行引起的空白
  var codes = document.querySelectorAll( 'code' );
  Array.prototype.forEach.call( codes, function( code ) {
    var html = code.innerHTML;
    code.innerHTML = html.replace( /^(?:\s*|\\r?\\n*)/, '' );
  });  

})();

