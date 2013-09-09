

;(function() {

  var slides = document.querySelectorAll( '.slide' );
  var TARGET_CLASS = 'slide-target';
  var nav = document.querySelector( '#navigator' );

  var updateui = function( message ) {

    var page = message.page;
    var pages = message.pages;

    // 隐藏 page.
    var old = document.querySelector( '.' + TARGET_CLASS );
    if ( old ) old.classList.remove( TARGET_CLASS );

    // 更新内容
    var target = slides[ page ] || slides[0];
    target.classList.add( TARGET_CLASS );

    // 让元素可见.
    target.scrollIntoView();

    // 更新 title.
    var h1 = target.querySelector( 'h1' );
    if ( h1 ) document.title = h1.innerText;

    // 更新进度条.
    nav.style.width = ( (page+1) / pages ) * 100 + '%';

  };

  var eventemitter = eventEmitter();
  eventemitter.on( 'on-page-changed', function( message ) {
    updateui( message );
  });

})();

