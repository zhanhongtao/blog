

;(function() {
  var cloest = function ( element, target ) {
      while ( element && element.nodeType === 1 ) {
          if ( matchesSelector(element, target) ) {
              return element;
          }
          element = element.parentNode;
      }
      return null;
  };

  // @note: 仅考虑了元素节点和文本节点.
  // @TODO: firefox 支持 textContent
  // @note: 使用 pre, 然后再 innerText 和 直接使用 textarea.
  var innerText = function( element ) {
    var text = '';
    var node = element.firstChild;
    while ( node ) {
      if ( node.nodeType === 1 ) {
        text += innerText( node );
      }
      else if ( node.nodeType === 3 ) {
        text += node.nodeValue;
      }
      node = node.nextSibling;
    }
    return text;
  };

  // 向外提供 innerText 方法.
  // 使用 response 方式支持返回值.
  var ee = eventEmitter();
  ee.on( 'innerText', function( element, response ) {
    if ( typeof response === 'function' ) {
      response( innerText(element) );
    }
  });

  // element.matches
  function matchesSelector( element, target ) {
    if ( element.webkitMatchesSelector ) {
      return element.webkitMatchesSelector( target );
    }
    else if ( element.msMatchesSelector ) {
      return element.msMatchesSelector( target );
    }
    else if ( element.mozMatchesSelector ) {
      return element.mozMatchesSelector( target );
    }
    else if ( element.matchesSelector ) {
      return element.matchesSelector( target );
    }
    // @todo: 向后兼容..
    return false;
  }

  var runcode = function( code ) {
    var fixCode = '(function() {' + code + '})()';
    var f = new Function( 'return ' + fixCode );
    f();
  };

  var displayRunButton = function( display, target ) {
    var runcase = target.querySelector( '.runcase' );
    if ( runcase ) {
      runcase.style.display = display ? 'block' : 'none';
    }
  };

  var runcases = document.querySelectorAll('.codebox');

  for ( var i = 0, l = runcases.length; i < l; i++ ) {
    var codebox = runcases[i];
    codebox.addEventListener( 'mouseover', function( event ) {
      displayRunButton( true, this );
    }, false );
    codebox.addEventListener( 'mouseout', function( event ) {
      displayRunButton( false, this );
    }, false );
  }

  document.addEventListener( 'click', function( event ) {
    var target = event.target;
    if ( matchesSelector(target, '.runcase') ) {
      var codebox = cloest(target, '.codebox');
      var pre = codebox.querySelector( 'pre' );
      if ( pre ) {
        runcode( innerText(pre) );
      }
    }
  }, false );

})();

