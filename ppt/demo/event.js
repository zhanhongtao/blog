;(function( root ) {

  var manager = {};

  var add = function ( name, callback ) {
    if (
      typeof name == 'string' ||
      typeof callback == 'function'
    ) {
      if ( manager[name] ) {
        manager[name].push( callback );
      } else {
        manager[name] = [ callback ];
      }
    }
  };

  var remove = function( name, callback ) {
    if ( typeof name == 'string' ) {
      var events = manager[name];
      if ( events ) {
        // 直接删除 name 组.
        if ( callback == null ) {
          delete manager[name];
        } else {
          // 删除指定 callback.
          if ( typeof callback == 'function' ) {
            for ( var i = 0, l = events.length; i < l; ++i ) {
              if ( callback === events[i] ) {
                events[i] = null;
              }
            }
          }
        }
      }
    }
  };

  var broadcast = function( name ) {
    var events;
    if ( typeof name == 'string' && (events = manager[name]) ) {
      for ( var i = 0, l = events.length; i < l; ++i ) {
        var callback = events[i];
        if ( typeof callback == 'function' ) {
          if ( callback.apply(null, [].slice.call(arguments, 1)) === false ) {
            break;
          }
        } else {
          events.splice( i, 1 );
          --i;
          --l;
        }
      }
    }
  };

  root.addListener = add;
  root.removeListener = remove;
  root.trigger = broadcast;

})( this );
