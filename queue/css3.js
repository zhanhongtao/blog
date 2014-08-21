var detectPrefix = (function () {
  var style = document.createElement( 'prefix' ).style;
  var memory = {};
  return function( key ) {
    if ( typeof memory[key] === 'undefined' ) {
      if ( style[key] !== undefined ) {
        memory[key] = '';
      }
      else {
        var prefixes = 'Webkit Moz ms'.split(' ');
        var ucKey  = key.charAt(0).toUpperCase() + key.slice(1);
        for ( var i = 0, l = prefixes.length; i < l; ++i ) {
          if ( style[prefixes[i] + ucKey] !== undefined ) {
            memory[key] = prefixes[i];
            break;
          }
        }
      }
    }
    return memory[key] || '';
  };  
})();

var eventsMap = {
  'Webkit': 'webkitAnimationEnd',
  'Moz': 'animationend',
  'ms': 'msAnimationend',
  '': 'animationend'
};
function animate( elem, classname, callback ) {
  var prefix = detectPrefix( 'animation' );
  var eventname = eventsMap[ prefix ];
  var listener = function() {
    callback();
    elem.removeEventListener( eventname, listener );
  };
  elem.addEventListener( eventname, listener, false);
  elem.classList.add( classname );
}
