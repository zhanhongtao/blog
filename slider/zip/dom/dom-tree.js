DOM - Tree

node(base)
element extends node

document
document.documentElement
document.head
document.body

document.domain
document.title
document.charset
document.activeElement
document.readyState

.nodeType
  * 元素节点(1)
  * 属性节点(2)
  * 文本节点(3)
  * 注释节点(8)
  * 文档节点(9)
  * fragment 节点(11)
.nodeName/.tagName(1)
.nodeValue(3)

elements.attributes
element.hasAttribute( key )
element.getAttribute( key )
element.setAttribute( key, value )
element.removeAttribute( key )

element.classList
element.classList.contains()
element.classList.add()
element.classList.remove()
element.classList.toggle()

element.dataset

element.id
element.className

document.getElementById()
document.getElementsByName()
document.getElementsByTagName()
document.getElementsByClassName()
document.querySelector()
document.querySelectorAll()

element
element.parentNode/element.parentElement
element.nextSibling/element.nextElementSibling
element.previousSibling/element.previousElementSibling
element.hasChildNodes()
element.childElementCount
element.childNodes/element.children
element.firstChild/element.firstElementChild
element.lastChild/element.lastElmentChild

element.contains( node )
element.compareDocumentPosition( node )
  * 0 相同元素
  * 1 文档无关 - 两个节点不在相同文档
  * 2 node 在 element 之前
  * 4 node 在 element 之后
  * 8 node 包含 element 节点
  * 16 node 被 element 节点包含
  * 32 扩展


document.createElement( tag )
document.createTextNode( text )
document.createDocumentFragment()
element.cloneNode( isdeep )

element.appendChild( node )
element.parentNode.insertBefore( node, element )
element.parentNode.removeChild( element )
element.parentNode.replaceChild( node, element )
element.remove()


element.innerHTML
element.outerHTML
element.innerText/element.textContent
  * node.innerText 不支持 `style` 和 `script` 标签.
  * node.innerText 不返回隐藏标签的内容.
  * node.innerText 会引起 reflow.
element.outerText
element.insertAdjacentElement( position, node )
element.insertAdjacentHTML( position, html )
element.insertAdjacentText( position, text )
position: beforebegin/afterbegin/beforeend/afterend


textNode.nodeValue/textNode.data
textNode.appendData( text )
textNode.deleteData( text )
textNode.insertData( offset, count )
textNode.replaceData( offset, count, text )
textNode.splitText( offset )
textNode.substringData( offset, count )
node.normalize()
node.length


element.style[ property ] = value
element.style.cssText = CSS_TEXT_STRING
style = window.getComputedStyle( element, pseudo_class )
style = document.defaultView.getComputedStyle( element, pseduo_class )
style = element.currentStyle


element.addEventListener
element.dispatchEvent
element.removeEventListener

// iframe document!
iframe.contentDocument || iframe.contentWindow.document

// height/width - by css.
element.scrollHeight
element.offsetHeight

// viewport size!
window.innerHeight/window.innerWidth
document.documentElement.clientHeight/document.documentElement.clientWidth

element.scrollIntoView()
element.scrollTop/element.scrollLeft
// page size
element.scrollHeight/element.scrollWidth
Math.max( 
  (document.documentElement || document.body).scrollHeight,
  (document.documentElement || document.body).offsetHeight,
  document.documentElement.clientHeight
);
element.getBoundingClientRect().top + window.pageYOffset;

scroll 指整个元素(可能由于 overflow 没有显示)
element.scrollHeight - element.scrollTop 和 element.clientHeight 关系来确定滚动条位置
.clientHeight = contentHeight + paddingTop + paddingBottom
.offsetHeight = contentHeight + paddingTop + paddingBottom + borderTopWidth + borderBottomWidth + scrollBarWidth

// relative document/parentNode
element.offsetParent
element.offsetTop/element.offsetLeft
element.offsetHeight/element.offsetWidth
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement

// relative view port
element.getBoundingClientRect()

// scroll position!
window.pageYOffset/window.pageXOffset
document.documentElement.scrollTop/document.documentElement.scrollLeft
document.body.scrollTop/document.body.scrollTop
https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY


Links:
https://developer.mozilla.org/en-US/docs/Web/API/Node
https://developer.mozilla.org/en-US/docs/Web/API/Element

https://github.com/jquery/jquery/blob/master/src/offset.js
https://github.com/jquery/jquery/blob/master/src/dimensions.js
https://github.com/jquery/jquery/blob/master/src/css.js
https://github.com/jquery/jquery/blob/master/src/wrap.js
https://github.com/jquery/jquery/blob/master/src/traversing.js
https://github.com/jquery/jquery/blob/master/src/manipulation.js

https://github.com/jieyou/lazyload/blob/master/lazyload.js
https://gist.github.com/wintercn/5925837
http://www.w3.org/TR/html5/


function css( element, name ) {
  if ( element.style[ name ] ) {
    return element.style[ name ];
  } else if ( element.currentStyle ) {
    return element.currentStyle[ name ];
  } else if ( document.defaultView && document.defaultView.getComputedStyle ) {
    name = name.replace( /([A-Z])/g, '-$1' ).toLowerCase();
    var style = document.defaultView.getComputedStyle( element, '' );
    return style && style.getPropertyValue( name );
  }
  return '';
}

function isInViewPort( element, filter ) {
  var rect = element.getBoundingClientRect();
  return filter( rect );
}

function someInViewPort( rect ) {
  var viewport = {
    w: window.innerWidth || root.clientWidth,
    h: window.innerHeight || root.clientHeight
  };
  return (
    (rect.top > 0 && rect.top < viewport.h) && 
    (rect.left > 0 && rect.left < viewport.w)
  ) || (
    (rect.bottom > 0 && rect.bottom < viewport.h) &&
    (rect.right > 0 && rect.right < viewport.w)
  );
}

function allInViewPort( rect ) {
  return rect.top > 0 && rect.right > 0 && rect.bottom > 0 && rect.left > 0;
}

function _appfilter( rect ) {
  return rect.top > 10 && rect.bottom > 0;
}

function scrollDo( scrolldo ) {
  var root = document.documentElement;
  var pageY = Math.max( 
    (root || document.body).scrollHeight,
    (root || document.body).offsetHeight,
    root.clientHeight
  );
  var scrollTop = window.pageYOffset || root.scrollTop;
  scrolldo( pageY, scrollTop );
}

