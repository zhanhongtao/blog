
;(function( root ) {
  function extend(b, o) {
    for (var key in o) {
      b[key] = o[key];
    }
    return b;
  }
  var cookie = root.cookie = function( name, value, options ) {
    if ( typeof value == 'undefined' ) {
      var _cookie = document.cookie;
      if ( _cookie && _cookie != '' ) {
        var list = _cookie.split(';');
        for ( var i = 0, l = list.length; i < l; ++i ) {
          var item = list[i];
          item = item.replace(/^\s*|\s*$/, '');
          if ( item.slice(0, name.length + 1) === (name + '=') ) {
            value = decodeURIComponent( item.slice(name.length + 1) );
            break;
          }
        }
      }
      return value;
    } else {
      options = extend({}, options || {});
      if ( value === null ) {
        value = '';
        options.expires = -1;
      }
      var expires = '';
      if ( options.expires && 
        (typeof options.expires == 'number' || options.expires.toUTCString)
      ) {
        var date;
        if (typeof options.expires == 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
          date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
      }
      var path = options.path ? '; path=' + (options.path) : '';
      var domain = options.domain ? '; domain=' + (options.domain) : '';
      var secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');      
    }
  };
})( this );

/*
  var _cookie = cookie;
  var defaultSetting = {
    path: '/',
    domain: 'github.com',
    expires: 30
  };

  cookie = function( name, value ) {
    if ( arguments.length == 1 ) {
      return _cookie( name );
    } else {
      _cookie( name, value, defaultSetting );
    }
  };
  
  cookie( 'name', 'redky' );
  cookie( 'name' ) === 'redky';
*/