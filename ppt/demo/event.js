!(function (name, definition) {
  var hasDefine = typeof define === 'function',
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition();
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('Sevent', function() {

  var ALL_EVENT_NAME = '__ALL_EVENT__';
  var SLICE = Array.prototype.slice;
  
  var Sevent = function( id ) {
    if ( !(this instanceof Sevent) ) {
      return new Sevent( id );
    }
    if ( id ) this.id = id;
    this._cbs = {};
    this._fired = {};
  };

  Sevent.prototype.bind = function ( name, callback ) {
    if ( typeof name == 'string' && typeof callback == 'function' ) {
      var cbs = this._cbs[name] = this._cbs[name] || [];
      cbs.push( callback );
    }
    return this;
  };

  Sevent.prototype.on = Sevent.prototype.bind;
  Sevent.prototype.listen = Sevent.prototype.bind;
  Sevent.prototype.addListener = Sevent.prototype.bind;
  Sevent.prototype.addEventListener = Sevent.prototype.bind;
  
  Sevent.prototype.unbind = function( name, callback ) {
    if ( typeof name == 'string' ) {
      var events = this._cbs[name];
      if ( events ) {
        // 直接删除 name 组.
        if ( callback == null ) {
          delete this._cbs[name];
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
    } else {
      this._cbs = {};
    }
    return this;
  };
  
  Sevent.prototype.off = Sevent.prototype.unbind;
  Sevent.prototype.removeListener = Sevent.prototype.unbind;
  Sevent.prototype.removeEventListener = Sevent.prototype.unbind;
  
  Sevent.prototype.trigger = function( name ) {
    var events, callback;
    if ( typeof name == 'string' ) {
      var times = 2;
      while ( times-- ) {
        events = this._cbs[ times ? name : ALL_EVENT_NAME ];
        if ( events ) {
          for ( var i = 0, l = events.length; i < l; ++i ) {
            callback = events[i];
            if ( typeof callback == 'function' ) {
              var args = times ? [].slice.call(arguments, 1) : arguments;
              callback.apply( this, args );
            } else {
              events.splice( i, 1 );
              --i;
              --l;
            }
          }
        }
      }
    }
    return this;
  };

  Sevent.prototype.emit = Sevent.prototype.trigger;
  Sevent.prototype.notify = Sevent.prototype.trigger;    
  
  Sevent.prototype.once = function( name, callback ) {
    var self = this;
    var wraper = function() {
      callback.apply( null, arguments );
      self.unbind( name, wraper );
    };
    this.bind( name, wraper );
    return this;
  };
  
  Sevent.prototype.assign = Sevent.prototype.once;
  Sevent.prototype.one = Sevent.prototype.once;
  
  function assign() {
    var argsLength = arguments.length;

    if ( argsLength < 3 ) {
      return this;
    }

    var names = [].slice.call( arguments, 0, -2 );
    var callback = arguments[ argsLength - 2 ];
    var isOnce = arguments[ argsLength - 1];

    if ( typeof callback !== 'function' ) {
      return this;
    }

    var self = this;
    var flag = {};
    var count = names.length;
    var method = isOnce ? 'once' : 'bind';
    var bind = function( key, method ) {
      self[method]( names[i], function(data) {
        self._fired[key] = self._fired[key] || {};
        self._fired[key].data = data;
        if ( !flag[key] ) {
          flag[key] = true;
          --count;
        }
      });
    };

    for ( var i = 0, l = names.length; i < l; ++i ) {
      bind(names[i], method);
    }

    var all = function( name ) {
      if ( count > 0 ) {
        return;
      }

      if ( !flag[name] ) {
        return;
      }

      var data = [];
      for ( var i = 0, l = names.length; i < l; ++i ) {
        var key = names[i];
        data.push( self._fired[key].data );
      }

      if ( isOnce ) {
        self.unbind( ALL_EVENT_NAME, all );
      }
      callback.apply( self, data );
    };

    this.bind( ALL_EVENT_NAME, all );
  }

  Sevent.prototype.all = function() {
    var args = [].slice.call( arguments );
    args.push( true );
    assign.apply( this, args );
    return this;
  };
  
  Sevent.prototype.assign = Sevent.prototype.all;
  
  Sevent.prototype.tail = function() {
    var args = [].slice.call( arguments );
    args.push(false);
    assign.apply(this, args);
    return this;
  };

  Sevent.create = function() {
    return new Sevent();
  };
  
  return Sevent;
});
