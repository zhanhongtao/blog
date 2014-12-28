var default_item_width = 240;
var box = document.getElementById( 'box' );
var helper = document.getElementById( 'box-helper' );
var list = box.getElementsByTagName( 'li' );
helper.style.width = list.length * default_item_width + 'px';

var pfx = (function () {
  var style = document.createElement('dummy').style,
      prefixes = 'Webkit Moz O ms Khtml'.split(' '),
      memory = {};
  return function ( prop ) {
      if ( typeof memory[ prop ] === "undefined" ) {
          var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
              props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
          memory[ prop ] = null;
          for ( var i in props ) {
              if ( style[ props[i] ] !== undefined ) {
                  memory[ prop ] = props[i];
                  break;
              }
          }
      }
      return memory[ prop ];
  };
})();

var transform = pfx( 'transform' );

var myslide = slide({
  max: list.length,
  rotate: true,
  onchange: function( to, from, oto ) {
    var i = 0;
    while ( i < 2 ) {
      var index = to + i;
      if ( index < list.length ) {
        var img = list[index].getElementsByTagName( 'img' )[0];
        if ( !img.loaded ) {
          img.src = img.getAttribute( 'data-src' );
          img.loaded = 1;
        }
      }
      ++i;
    }
    // 直接使用 css3 的 transition + transform 实现.
    helper.style[transform] = 'translate(' + (-1 * to * default_item_width) + 'px' + ')';
  }
});

var btns = box.getElementsByTagName( 'button' );
for ( var i = 0, l = btns.length; i < l; ++i ) {
  btns[i].onclick = function() {
    var className = this.className;
    if ( className === 'next' ) {
      myslide.next();
    }
    else if ( className == 'prev' ) {
      myslide.prev();
    }
  };
}


// 简单尝试 Touch 事件.
var xtouch = {};
function resettouch() {
  delete xtouch.pageX;
}

box.addEventListener( 'touchstart', function(e) {
  var touch = e.touches[0];
  xtouch.pageX = touch.pageX;
}, false );

box.addEventListener( 'touchmove', function(e) {
  e.preventDefault();
}, false );

box.addEventListener( 'touchend', function(e) {
  var touch = e.changedTouches[0];
  var pageX = touch.pageX;
  var offset = pageX - xtouch.pageX;
  if ( Math.abs(offset) >= 20 ) {
    if ( offset > 0 ) myslide.prev();
    else myslide.next();
  }
  resettouch();
}, false );

box.addEventListener( 'touchcancel', function(e) {
  resettouch();
}, false );
