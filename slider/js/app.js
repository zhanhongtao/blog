// 自执行函数.
;(function() {

  // 无 new 实例化.
  var eventemitter = eventEmitter();
  var isOpenToggle = /[?&#]v=1/i.test( location.href );
  if ( isOpenToggle ) {
    [].slice.call( document.querySelectorAll( '.toggle' ), 0 ).forEach(function( dom ) {
      dom.classList.remove( 'toggle' );
    });
  }
  var selector = isOpenToggle ? '.slide' : '.slide:not(.toggle)';
  var slides = document.querySelectorAll( selector ); // Command API -> $$

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

  function getIndex( id ) {
    var index = 0;
    if( id && id.indexOf('=') == -1 ) {
      index = Number(id);
      if ( isNaN(index) ) {
        for ( var i = 0, l = slides.length; i < l; ++i ) {
          if ( id == slides[i].id ) {
            index = i;
            break;
          }
        }
      } else {
        index = index >= slides.length ? 0 : index;
      }
    }
    return index;
  };

  function getPageFromHash() {
    // 支持 id 访问.
    var reg = /#([^&]*)/i;
    var id;
    location.href.replace( reg, function( match, $1 ) {
      id = $1;
    });
    return id;
  }

  var page = (function() {
    var id = getPageFromHash();
    return getIndex( id );
  })();

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
      direction: direction,
      id: slides[page].id || ''
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
      fixed.classList.add( 'yellowfade' );
      fixed.style.display = '';
      fixed.scrollIntoView();
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
    var node = dom.walkToRoot( target, function( target ) {
      if ( target.nodeName.toLowerCase() === 'code' ||
        (target.getAttribute && target.getAttribute('contenteditable') == 'true')
      ) {
        return false;
      }
    });
    if ( node ) {
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
          var _index = getIndex( prompt('跳转到指定页:') );
          updatePage( _index );
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
          eventemitter.emit( 'on-page-pattern-changed', page );
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  }, false );

  // @NOTE: 方便无键盘用户使用. ex: 手机.
  document.addEventListener( 'click', function( event ) {
    var target = event.target;
    var dataset = target.dataset;
    if ( dataset.id == 'nav' ) {
      dataset.direction == 'next' ? nextSlide() : prevSlide();
      event.preventDefault();
    }
  }, false );

  eventemitter.on( 'on-next-editor', function() {
    var pre = dom.cloest( document.activeElement, 'code' );
    var slide = dom.cloest( document.activeElement, '.slide' );
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
    if ( location.href.indexOf('nav=show') > -1 ) {
      document.body.classList.add( 'display-navigator' );
    }
  }

  init( false );

  window.onpopstate = function() {
    var id = getPageFromHash();
    page = getIndex( id );
    init( true );
  };

  eventemitter.emit( 'ppt-init', page );
  eventemitter.on( 'ppt-next', nextSlide );
  eventemitter.on( 'ppt-prev', prevSlide );

})();

