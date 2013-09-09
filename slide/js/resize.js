

;(function() {

  var slides = document.querySelectorAll( '.slide' );
  var body = document.querySelector( 'body' );
  var page = 0;

  // 窗口 resize 时, 仅对当前 slide 做绽放处理.
  // 因此在转换文档显示模式时, 需处理.
  var resize = function( page ) {
    if ( !body.classList.contains('ppt') ) {
        return;
    }
    if ( page == null ) page = 0;
    var winsize = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    var style = document.defaultView.getComputedStyle( slides[page], null );
    var slidesize = {
      w: parseInt(style.width, 10),
      h: parseInt(style.height, 10)
    };
    var w = winsize.w / slidesize.w;
    var h = winsize.h / slidesize.h;
    var scale = Math.min.call( Math, w, h );
    slides[ page ].style.webkitTransform = 'scale(' + scale + ')';
  };

  var resize2 = throttle( resize, 150 );

  window.addEventListener( 'resize', function() {
    resize2( page );
  }, false );

  var eventemitter = eventEmitter();
  eventemitter.on( 'on-page-changed', function( message ) {
    resize( page = message.page );
  });

  eventemitter.on( 'on-resize', function() {
    resize( page );
  });

})();

