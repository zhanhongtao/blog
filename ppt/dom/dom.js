var dom = {};

dom.id = function( id ) {
  return document.getElementById( id );
};

dom.tag = function( tag, context ) {
  return ( context || document ).getElementsByTagName( tag );
};

dom.prev = function ( element ) {
  do {
    element = element.previousSibling;
  } while ( element && element.nodeType != 1 )
  return element;
}

dom.next = function( element ) {
  do {
    element = element.nextSibling;
  } while ( element && element.nodeType != 1 )
  return element;
}

dom.first = function ( element ) {
  element = element.firstChild;
  return element && element.nodeType == 1 ? 
    element : dom.next( element );
}

dom.last = function ( element ) {
  element = element.lastChild;
  return element && element.nodeType == 1 ?
    element : dom.prev( element );
}

dom.parent = function ( element, number ) {
  number = number || 1;
  var i = 0;
  while ( i < number ) {
    if ( element ) {
      element = element.parentNode;
    }    
    ++i;
  }
  return element;
}

dom.text = function( elements ) {
  var text = '';
  elements = elements.childNodes || elements;
  var i = 0, l = elements.length;
  while ( i < l ) {
    var element = elements[i];
    t += element.nodeType != 1 ?
      element.nodeValue : dom.text(element.childNodes);
    ++i;
  }
  return text;
};

dom.html = function( element ) {
  return element.innerHTML;
};

dom.hasAttribute = function( element, name ) {
  return element.getAttribute( name ) != null;
};

dom.attr = function( element, name, value ) {
  var attributeHook = {
    'for': 'htmlFor',
    'class': 'className'
  };
  name = attributeHook[ name ] || name;
  if ( typeof name !== 'undefined' ) {
    element[ name ] = value;
    if ( element.setAttribute ) {
      element.setAttribute( name, value );
    }
  }
  return element[ name ] || element.getAttribute( name ) || '';
};

dom.remove = function( element ) {
  if ( elment ) {
    element.parentNode.removeChild( element );
  }
};

dom.empty = function( element ) {
  var first;
  while ( first = element.firstChild ) {
    dom.remove( first );
  }
};

// @todo.
dom.append = function() {};

// @todo.
dom.ready = function() {};

dom.css = function( element, name ) {
  if ( element.style[ name ] ) {
    return element.style[ name ];
  } else if ( element.currentStyle ) {
    return element.currentStyle[ name ];
  } else if ( document.defaultView && document.defaultView.getComputedStyle ) {
    name = name.replace( /([A-Z])/g, '-$1' ).toLowerCase();
    var style = document.defaultView.getComputedStyle( element, '' );
    return style && style.getPropertyValue( name );
  }
  return null;
};

// 相对于 page!
dom.pageX = function( element ) {
  return element.offsetParent ?
    element.offsetLeft + dom.pageX( element.offsetParent ) :
    element.offsetLeft;
};

dom.pageY = function( element ) {
  return element.offsetParent ?
    element.offsetTop + dom.pageY( element.offsetParent ) :
    element.offsetTop;
};

// 相对父元素
dom.parentX = function( element ) {
  return element.parentNode == element.offsetParent ?
    element.offsetLeft :
    dom.pageX( element ) - dom.pageX( element.parentNode );
};

dom.parentY = function( element ) {
  return element.parentNode == element.offsetParent ?
    element.offsetTop :
    dom.pageY( element ) - dom.pageY( element.parentNode );
};

// 元素尺寸
dom.height = function( element ) {
  var height;
  if ( dom.css(element, 'display') != 'none' ) {
    height = dom.css( element, 'height' );
    return parseInt( height, 10 );
  }
  var old = dom.resetCSS( element, {
    display: '',
    visibility: 'hidden',
    position: 'absolute'
  });
  height = element.clientHeight || dom.css( element, 'height' );
  dom.restoreCSS( element, old );
  return parseInt( height, 10 );
};

dom.width = function( element ) {
  var width;
  if ( dom.css(element, 'display') != 'none' ) {
    width = dom.css( element, 'width' );
    return parseInt( width, 10 );
  }
  var old = dom.resetCSS( element, {
    display: '',
    visibility: 'hidden',
    position: 'absolute'
  });
  width = element.clientHeight || dom.css( element, 'width' );
  dom.restoreCSS( element, old );
  return parseInt( width, 10 );
};

// 针对不可见元素, 去尺寸.
dom.resetCSS = function( element, prop ) {
  var old = {};
  for ( var key in prop ) {
    old[ key ] = prop[ key ];
    element.style[ key ] = prop[ key ];
  }
  return old;
}

docm.restoreCSS = function( element, prop ) {
  for ( var key in prop ) {
    element.style[ key ] = prop[ key ];
  }
}

dom.hide = function( element ) {
  var display = dom.css( element, 'display' );
  if ( display != 'none' ) {
    element._old_display = display;
    element.style.display = 'none';
  }  
};

dom.show = function() {
  element.style.display = element._old_display || '';
};

dom.opacity = function( element, level ) {
  if ( element.filters ) {
    element.style.filters = 'alpha(opacity=' + level + ')' );
  } else {
    element.style.opacity = level / 100;
  }
};

// 网页尺寸
dom.pageHeight = function() {
  return document.body.scrollHeight;
};

dom.pageWidth = function() {
  return document.body.scrollWidth;
};

// 滚动条位置
dom.scrollX = function() {
  // ie6/7 严格模式
  var de = document.documentElement;
  return self.pageXOffset || ( de && de.scrollLeft ) || document.body.scrollLeft;
};

dom.scrollY = function() {
  // ie6/7 严格模式
  var de = document.documentElement;
  return self.pageYOffset || ( de && de.scrollTop ) || document.body.scrollTop;
};

// 可视区域尺寸.
dom.windowHeight = function() {
  var de = document.documentElement;
  return self.innerHeight ||
    ( de && de.clientHeight ) ||
    docuemnt.body.clientHeight;
};

dom.windowWidth = function() {
  var de = document.documentElement;
  return self.innerWidth ||
    ( de && de.clientWidth ) ||
    docuemnt.body.clientWidth;
};

// 以下为 fixEvent 内容
dom.fixevent = function( event ) {
  // @todo.
  return event;
};

dom.getX = function( event ) {
  event = dom.fixevent( event );
  return event.pageX || event.clientX + document.body.scrollLeft;
};

dom.getY = function( event ) {
  event = dom.fixevent( event );
  return event.pageY || event.clientY + document.body.scrollTop;
};

dom.getElementX = function( event ) {
  return ( event && event.layerX ) || event.offsetX;
};

dom.getElementY = function( event ) {
  return ( event && event.layerY ) || event.offsetY;
};

