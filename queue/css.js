;(function( global ) {
  // 简单封装 transition.
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

  function css( elem, prop, cb ) {
    if ( typeof prop === 'string' ) {
      var style = {};
      if ( prop.indexOf( ':' ) > -1 ) {
        return elem.style.cssText = prop;
      }
      else if ( window.getComputedStyle ) {
        style = window.getComputedStyle( elem );
      }
      else if ( elem.currentStyle ) {
        style = elem.currentStyle;
      }
      return style[ prop ];
    }
    var key, pkey, transform = '', cssText = '';
    for ( key in prop ) {
      if ( prop.hasOwnProperty(key) ) {
        pkey = pfx( key );
        switch( pkey ) {
          case 'rotate':
          case 'translate':
          case 'skew':
            transform += key + '(' + config[key] + ') ';
            break;
          default:
            cssText += key + ':' + config[ key ] + ';';
        }
        cssText += transform;
        dom.style.cssText = cssText;
      }
    }
  }
  
  global.css = css;
})( this );

