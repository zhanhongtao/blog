var cloest = function ( element, target ) {
  var matches = element.matches || 
    element.msMatchesSelector ||
    element.webkitMatchesSelector ||
    element.mozMatchesSelector;
  while ( element && element.nodeType === 1 ) {
    if ( matches.call( element, target) ) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
};

function walkToRoot( node, handle ) {
  while ( node ) {
    if ( handle(node) === false ) break;
    node = node.parentNode;
  }
  return node;
}

;(function() {
  // @note: 仅考虑了元素节点和文本节点.
  // @note: 使用 pre, 然后再 innerText 和 直接使用 textarea.
  // @note: 块状元素时, 取文本添加换行符 - runcode 特殊处理.
  // @TODO: firefox 支持 textContent
  var innerText = function( element ) {
    var text = '';
    var node = element.firstChild;
    while ( node ) {
      if ( node.nodeType === 1 ) {
        // contenteditable 会创建 div.
        text += ( node.nodeName.toLowerCase() === 'div' ? '\n' : '' ) + innerText( node );
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

  var runcode = function( code ) {
    var fixCode = '(function() {\n' + code + '\n})();';
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
    var isRun = cloest( target, '.runcase' );
    if ( isRun ) {
      var codebox = cloest(target, '.codebox');
      // var pre = codebox.querySelector( 'pre' );
      var pre = codebox.querySelector( 'code' );
      if ( pre ) {
        runcode( innerText(pre) );
        event.stopImmediatePropagation();
      }
    }
  }, false );

  /*
    iframe
    if ( window.document.designMode !== 'on' ) {
      window.document.designMode = 'on';
    }
  */

  // @todo: 实现 tab 插入 空格.
  document.addEventListener( 'keydown', function( event ) {
    var target = event.target;
    if ( event.which === 9 || event.keyCode === 9 ) {
      if ( cloest(target, 'code[contenteditable=true]') ) {
        insertTextAtCursor( '  ' );
        event.preventDefault();
      }
    }
  }, false );

  // from: http://91r.net/ask/16601934.html
  function insertTextAtCursor(text) {
    var sel, range, html;
    sel = window.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    var textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
  }

})();

