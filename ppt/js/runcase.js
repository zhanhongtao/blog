;(function( root ) {

  function cloest( element, target ) {
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

  function innerText( element ) {
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
  }

  root.dom = {
    cloest: cloest,
    walkToRoot: walkToRoot,
    innerText: innerText
  };

})( this );

;(function() {

  function runcode( code ) {
    var fixCode = '(function() {\n' + code + '\n})();';
    var f = new Function( 'return ' + fixCode );
    f();
  }

  // 向外提供 innerText 方法.
  // 使用 response 方式支持返回值.
  var ee = eventEmitter();
  ee.on( 'code', function( request ) {
    var cmd = request.cmd;
    if ( cmd == 'run' ) {
      runcode(
        dom.innerText( request.element )
      );
    }
  });

  var displayRunButton = function( display, target ) {
    var runcase = target.querySelector( '.runcase' );
    if ( runcase ) {
      runcase.style.display = display ? 'block' : 'none';
    }
  };

  var runcases = document.querySelectorAll('.code');
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
    var isRun = dom.cloest( target, '.runcase' );
    if ( isRun ) {
      var pre = dom.cloest(target, '.code');
      var code = pre.querySelector( 'code' );
      if ( code ) {
        runcode( dom.innerText(code) );
        event.stopImmediatePropagation();
      }
    }
  }, false );

  document.addEventListener( 'keydown', function( event ) {
    var target = event.target;
    if ( event.which === 9 || event.keyCode === 9 ) {
      if ( dom.cloest(target, 'code[contenteditable=true]') ) {
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

