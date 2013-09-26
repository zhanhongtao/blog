

;(function() {

  var slides = document.querySelectorAll( '.slide' );
  var body = document.querySelector( 'body' );
  var page = 0;

  // 窗口 resize 时, 仅对当前 slide 做绽放处理.
  // 因此在转换文档显示模式时, 需处理.
  var resize = function( page ) {
    // 不支持 classList 浏览器, 不提供 resize 功能.
    if ( !body.classList ) return;

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
    // x 0.9 防止 slide page 过大.
    var scale = Math.min.call( Math, w, h, 2 ) * 0.9;
    slides[ page ].style.zoom = scale;
    // slides[ page ].style.webkitTransform = 'scale(' + scale + ')';
    // slides[ page ].style.MozTransform = 'scale(' + scale + ')'; // Moz 中的 m 大写.
  };

  var resize2 = se.debounce( resize, 150 );

  window.addEventListener( 'resize', function() {
    resize2( page );
  }, false );

  var eventemitter = eventEmitter();
  eventemitter.on( 'on-page-changed', function( message ) {
    resize( page = message.page );
  });

  eventemitter.on( 'on-resize-to', function( zoom ) {
    var i = 0;
    var pages = slides.length;
    while ( i < pages ) {
      var slide = slides[i];
      slide.style.zoom = zoom;
      // slide.style.webkitTransform = 'scale(1)';
      // slide.style.MozTransform = 'scale(1)';
      // slide.style.msTransform = 'scale(1)';
      // slide.style.oTransform = 'scale(1)';
      i++;
    }
  });

  eventemitter.on( 'on-resize', function() {
    resize( page );
  });

})();

