var eProxy = function() {
  this.callbacks = {};
};

eProxy.callbacks = {};

eProxy.listen = eProxy.prototype.listen = function( name, callback ) {
  var callbacks = this.callbacks[name] = this.callbacks[name] || [];
  callbacks.push( callback );
};

eProxy.remove = eProxy.prototype.remove = function( name, callback ) {
  if ( typeof name == 'string' ) {
    var callbacks = this.callbacks[name];
    if ( callbacks ) {
      // 直接删除 name 组.
      if ( callback == null ) {
        delete this.callbacks[name];
      } else {
        // 删除指定 callback.
        if ( typeof callback == 'function' ) {
          for ( var i = 0, l = callbacks.length; i < l; ++i ) {
            if ( callback === callbacks[i] ) {
              callbacks[i] = null;
            }
          }
        }
      }
    }
  }
};

eProxy.notify = eProxy.prototype.notify = function( name ) {
  var callbacks = this.callbacks[name];
  if ( callbacks && typeof name == 'string' ) {
    for ( var i = 0;  i < callbacks.length; ++i ) {
      var callback = callbacks[i];
      if ( typeof callback == 'function' ) {
        callback.apply( null, [].slice.call(arguments,1) );
      } else {
        callbacks.splice( i, 1 );
        --i;
      }
    }
  }
};

// 支持定义全局消息
// 支持内部消息
