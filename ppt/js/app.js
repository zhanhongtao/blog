// 自执行函数.
;(function() {

  // 无 new 实例化.
  var eventemitter = eventEmitter();
  var slides = document.querySelectorAll( '.slide:not(.toggle)' ); // Command API -> $$
  
  // 伪数组处理
  Array.prototype.forEach.call( slides, function( slide, index ) {
    slide.setAttribute( 'tabindex', 1 + index );
  });
  
  Array.prototype.forEach.call( document.querySelectorAll('.sub-slide'), function( dom ) {
    dom.style.display = 'none';
  });

  var body = document.querySelector( 'body' ); // Command API -> $
  var rotate = localStorage.rotate === 'true' || false; // cookie/session/localStorage/sessionStorage/indexDB/Application Cache.
  var pages = slides.length;
  var debug = false;

  var getIndex = function() {
    var hash = location.hash;
    return ~~(hash.slice(1));    
  }
  
  var page = getIndex();

  // 修正 index - rotate!
  function fixedIndex( page, pages, rotate ) {
    if ( rotate ) {
      page = ( pages + page % pages ) % pages;
    }
    else {
      page = Math.min.call( Math, page, pages - 1 );
      page = Math.max.call( Math, page, 0 );
    }
    return page;
  }

  // 自定义函数
  var updatePage = function( direction, hash ) {
    if ( direction === 'next' ) ++page;
    else if ( direction === 'prev' ) --page;
    else page = direction;
    page = fixedIndex( page, pages, rotate );
    var next = fixedIndex( page + 1, pages, rotate );
    var prev = fixedIndex( page - 1, pages, rotate );
    eventemitter.emit( 'on-page-changed', {
      from: hash,
      page: page,
      next: next,
      prev: prev,
      pages: pages,
      direction: direction
    });
  };

  updatePage = se.wrap( updatePage, function( direction, next ) {
    if ( typeof direction == 'number' ) {
      return next();
    }
    var slide = slides[page];
    var sections = slide.querySelectorAll( '.sub-slide' );
    var l = sections.length;
    if ( l == 0 ) {
      return next();
    }
    var section, index = -1;
    // 找到需要处理的位置.
    for ( var i = 0; i < l; ++i ) {
      if ( !sections[i].matches( '.sub-slide-toggle' ) ) {
        section = sections[i];
        index = i;
        break;
      }
    }
    var fixed;
    if ( direction == 'next' ) {
      // 最后
      if ( index == -1 ) return next();
      // 其他位置直接处理.
      fixed = sections[ index ];
      fixed.classList.add( 'sub-slide-toggle' );
      fixed.style.display = '';
    } else {
      // 第一位置
      if ( index == 0 ) return next();
      // 修正已处理完情况
      if ( index == -1 ) index = l;
      // 向回走 1, 处理.
      fixed = sections[ index - 1 ];
      fixed.classList.remove( 'sub-slide-toggle' );
      fixed.style.display = 'none';
    }
  });
  
  // next/prev!
  var nextSlide = function() {
    updatePage( 'next' );
  };
  
  var prevSlide = function() {
    updatePage( 'prev' );
  };

  // 拦截箭头 - hook
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
    if ( !event.altKey && isPreventSystemKey(target) ) {
      return;
    }
    var keycode = event.keyCode;
    switch( keycode ) {
      case 33: // pageUp
      case 37: // left
      // case 38: // up
        prevSlide();
        event.preventDefault();
        break;
      case 34: // pageDown
      case 39: // right
      // case 40: // down
        nextSlide();
        event.preventDefault();
        break;
      case 36: // home
        updatePage( 0 );
        event.preventDefault();
        break;
      case 35: // end
        updatePage( pages - 1 );
        event.preventDefault();
        break;
      case 71: // ctrl + g
        if ( event.ctrlKey ) {
          updatePage( ~~prompt('跳转到指定页:') );
          event.preventDefault();
        }
        break;
      case 84:
        if ( event.altKey ) {
          eventemitter.emit( 'on-next-editor' );
          event.preventDefault();
        }
      case 82: // ctrl + r
        if ( event.ctrlKey ) {
          rotate = !rotate;
          localStorage.rotate = rotate;
          event.preventDefault();
        }
        break;
      case 80: // alt + p
        if ( event.altKey ) {
          // @todo: 切换为普通文档 - 方便直接打印.
          eventemitter.emit( 'on-page-pattern-changed', page );
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  }, false );

  /*
  // @note: 不再支持 mousewheel
  var mousewheel = se.throttle(function( event ) {
    if ( event.wheelDelta ) {
      event.wheelDelta < 0 ? nextSlide() : prevSlide();
    }
    else if ( event.detail ) {
      -1 * event.detail < 0 ? nextSlide() : prevSlide();
    }
  }, 50 );
  */

  // document.addEventListener( 'mousewheel', mousewheel, false );
  // document.addEventListener( 'DOMMouseScroll', mousewheel, false );

  eventemitter.on( 'on-focus-target', function( page ) {
    slides[ page ].focus();
  });

  eventemitter.on( 'on-next-editor', function() {
    var pre = cloest( document.activeElement, 'code' );
    var slide = cloest( document.activeElement, '.slide' );
    if ( !slide ) return;
    var pres = slide.querySelectorAll( 'code' );
    if ( !pres ) return;
    var i = 0, l = pres.length;
    if ( pre ) {
      for ( ; i < l; ++i ) {
        if ( pre == pres[i] ) {
          ++i;
          break;
        }
      }
    } else {
      i = 0;
    }
    if ( pres[i] ) {
      pres[i].focus();
    }
  });

  function init( hash ) {
    updatePage( page, hash );
  }
  init( false );
  window.addEventListener( 'hashchange', function() {
    page = getIndex();
    init( true );
  }, false );
  eventemitter.emit( 'ppt-init', page );
  eventemitter.on( 'ppt-next', nextSlide );
  eventemitter.on( 'ppt-prev', prevSlide );
  eventemitter.on( 'change-pattern', function( pattern ) {
    pattern = pattern === 'ppt' ? 'ppt' : 'document';
    eventemitter.emit( 'on-page-pattern-changed', page, pattern );
  });

})();

