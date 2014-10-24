;(function() {
  
  var slides = document.querySelectorAll( '.slide' );
  slides = se.filterToggle( slides );
  var TARGET_CLASS = 'slide-target';
  var TARGET_FROM_DIRECTION_PREV_CLASS = 'slide-target-prev';
  var TARGET_FROM_DIRECTION_NEXT_CLASS = 'slide-target-next';
  var nav = document.querySelector( '#navigator' );

  var updateui = function( message ) {

    var page = message.page;
    var pages = message.pages;

    // 隐藏 page.
    var old = document.querySelector( '.' + TARGET_CLASS );
    if ( old ) {
      old.classList.remove( TARGET_CLASS );
      old.classList.remove( TARGET_FROM_DIRECTION_NEXT_CLASS );
      old.classList.remove( TARGET_FROM_DIRECTION_PREV_CLASS );
    }

    // 更新内容
    var target = slides[ page ] || slides[0];
    if ( target ) {
      target.classList.add( TARGET_CLASS );
      if ( [ 'next', 'prev' ].indexOf(message.direction) > -1 ) {
        target.classList.add( message.direction === 'next' ? TARGET_FROM_DIRECTION_NEXT_CLASS : TARGET_FROM_DIRECTION_PREV_CLASS );
      }
    }

    // 让元素可见.
    target.scrollIntoView();

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

