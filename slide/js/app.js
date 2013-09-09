

// 自执行函数.
;(function() {

  // 无 new 实例化.
  var eventemitter = eventEmitter();

  // 浏览器扩展函数
  var slides = document.querySelectorAll( '.slide' );
  var body = document.querySelector( 'body' );
  var rotate = false;
  var pages = slides.length;

  // 自执行函数.
  var page = (function() {
    var hash = location.hash;
    return ~~hash.slice(1);
  })();

  // 自定义函数
  var updatePage = function( p, hash ) {
    if ( p != null ) page = p;
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
      from: hash
    });
  };

  eventemitter.on( 'on-update-page', updatePage );

  var nextSlide = function() {
    page++;
    updatePage( page );
  };

  var prevSlide = function() {
    page--;
    updatePage( page );
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
      case 38: // up
        prevSlide();
        break;
      case 34: // pageDown
      case 39: // right
      case 40: // down
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
          event.preventDefault();
        }
        break;
      case 80: // alt + p
        if ( event.altKey ) {
          body.classList.toggle( 'ppt' );
          slides[page].scrollIntoView();
          if ( !body.classList.contains('ppt') ) {
            ;(function() {
              var i = 0;
              while ( i < pages ) {
                var slide = slides[i];
                slide.style.webkitTransform = 'scale(1)';
                i++;
              }
            })();
          }
          else {
            eventemitter.emit( 'on-resize' );
          }
          event.preventDefault();
          break;
        }
      default:
        break;
    }
  }, false );

  updatePage( page );

})();

