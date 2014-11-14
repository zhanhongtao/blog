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
    target.focus();

    // 更新 title.
    var h1 = target.querySelector( 'h1' );
    if ( h1 ) {
      eventemitter.emit( 'innerText', h1, function( title ) {
        document.title = title;
      });
    }

    // 更新进度条.
    nav.style.width = ( (page+1) / pages ) * 100 + '%';

  };

  var eventemitter = eventEmitter();
  eventemitter.on( 'on-page-changed', function( message ) {
    updateui( message );
  });

})();

