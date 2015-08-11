
function _handle(e) {
  var step = 0;
  if ( e.detail ) {
    step = e.detail / 3;
  } else if ( e.wheelDelta ) {
    step = e.wheelDelta / -120;
  }
  console.log( step, e );
}

if ( document.addEventListener ) {
  document.addEventListener( 'mousewheel', _handle, false );
  document.addEventListener( 'DOMMouseScroll', _handle, false );
} else if ( document.attachEvent ) {
  document.attachEvent( 'mousewheel', _handle );
} else {
  document.onmousewheel = _handle;
}

