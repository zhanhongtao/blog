

// 自执行函数.
;(function() {

  // 无 new 实例化.
  var eventemitter = eventEmitter();

  // 浏览器扩展函数
  var slides = document.querySelectorAll( '.slide' );
  var body = document.querySelector( 'body' );
  var rotate = localStorage.rotate === 'true' || false;
  var pages = slides.length;
  var debug = false;

  // 自执行函数.
  var page = (function() {
    var hash = location.hash;
    return ~~hash.slice(1);
  })();

  // 自定义函数
  var updatePage = function( p, hash ) {
    if ( p === 'next' ) page++;
    else if ( p === 'prev' ) page--;
    else page = p;

    if ( rotate ) {
      page = page >= pages ? 0 : page;
      page = page <= -1 ? pages - 1 : page;
    }
    else {
      page = Math.min.call( Math, page, pages - 1 );
      page = Math.max.call( Math, page, 0 );
    }
    eventemitter.emit( 'on-page-changed', {
      page: page,
      pages: pages,
      direction: p,
      from: hash
    });
  };

  eventemitter.on( 'on-update-page', updatePage );

  updatePage = se.wrap( updatePage, function( target, next ) {
    if ( typeof target === 'number' ) {
      return next();
    }

    if ( debug )
      console.trace( 'updatepage' );

    var slide = slides[ page ];
    var sections = slide.querySelectorAll( '.sub-slide' );

    // 不存在 sub-slide
    // 直接翻页.
    if ( !sections ) {
      return next();
    }

    var blockSections = slide.querySelectorAll( '.sub-slide-block' );
    var blockLength = blockSections ? blockSections.length : -1;

    // 已经是首个/最后一个 sub-slide
    // 直接翻页.
    if ( (target === 'next' && blockLength === sections.length) ||
        ( target === 'prev' && blockLength <= 0 )
    ) {
      return next();
    }

    // 否则更新相应 sub-slide 样式.
    var direction = target === 'next' ? blockLength : --blockLength;
    sections[ direction ].classList.toggle( 'sub-slide-block' );

  });

  var nextSlide = function() {
    updatePage( 'next' );
  };

  var prevSlide = function() {
    updatePage( 'prev' );
  };

  var isPreventSystemKey = function( target ) {
    var preventDefaultElements = [
      'input',
      'textarea',
      'select'
    ];
    if ( preventDefaultElements.indexOf(target.nodeName.toLowerCase()) > -1 ) {
      return true;
    }
    if ( target.getAttribute('contenteditable') === 'true' ) {
      return true;
    }
  };

  // 匿名函数
  document.addEventListener( 'keydown', function( event ) {
    var target = event.target;
    if ( isPreventSystemKey(target) ) {
      return;
    }
    var keycode = event.keyCode;
    switch( keycode ) {
      case 33: // pageUp
      case 37: // left
      // case 38: // up
        prevSlide();
        break;
      case 34: // pageDown
      case 39: // right
      // case 40: // down
        nextSlide();
        break;
      case 36: // home
        updatePage( 0 );
        break;
      case 35: // end
        updatePage( pages - 1 );
        break;
      case 71: // ctrl + g
        if ( event.ctrlKey ) {
          updatePage( ~~prompt('跳转到指定页:') );
          event.preventDefault();
        }
        break;
      case 82: // ctrl + r
        if ( event.ctrlKey ) {
          rotate = !rotate;
          localStorage.rotate = rotate;
          event.preventDefault();
        }
        break;
      case 80: // alt + p
        if ( event.altKey ) {
          eventemitter.emit( 'on-page-pattern-changed', page );
          event.preventDefault();
          break;
        }
      case 13:
        if ( event.altKey ) {
          if ( body.webkitIsFullScreen ) {
            body.webkitCancelFullScreen();
          }
          else {
            body.webkitRequestFullScreen();
          }
          event.preventDefault();
        }
      default:
        break;
    }
  }, false );

  // @note: 不再支持 mousewheel
  var mousewheel = se.throttle(function( event ) {
    // if ( body.classList.contains('ppt') )
    return;
    if ( event.wheelDelta ) {
      event.wheelDelta < 0 ? nextSlide() : prevSlide();
    }
    else if ( event.detail ) {
      -1 * event.detail < 0 ? nextSlide() : prevSlide();
    }
  }, 50 );

  document.addEventListener( 'mousewheel', mousewheel, false );
  document.addEventListener( 'DOMMouseScroll', mousewheel, false );

  updatePage( page );
  eventemitter.emit( 'ppt-init', page );

  eventemitter.on( 'ppt-next', nextSlide );
  eventemitter.on( 'ppt-prev', prevSlide );
  eventemitter.on( 'change-pattern', function( pattern ) {
    pattern = pattern === 'ppt' ? 'ppt' : 'document';
    eventemitter.emit( 'on-page-pattern-changed', page, pattern );
  });

})();

