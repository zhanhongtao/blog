function animate( elem, classname, callback ) {
  var eventname = 'animationend';
  var listener = function() {
    elem.removeEventListener( eventname, listener );
    callback();
  };
  elem.addEventListener( eventname, listener, false);
  elem.classList.add( classname );
}