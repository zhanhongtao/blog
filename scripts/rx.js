// 依赖 EventEmitter.
;(function( name, definition ) {
  var hasDefine = typeof define === 'function',
    hasExports = typeof module !== 'undefined' && module.exports;

  if ( hasDefine ) {
    define(definition);
  } else if (hasExports) {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
})( 'r', function() {
  var id = 1;

  function r( value ) {
    if ( !(this instanceof r) ) return new r(value);
    this.name = String(++id);
    this.core = value;
  }

  r.prototype = new EventEmitter( 'r' );
  r.prototype.constructor = r;

  r.prototype.update = function( value ) {
    this.core = value;
    this.emit( this.name );
    return this;
  };

  r.prototype.value = function() {
    return typeof this.core === 'function' ? this.core() : this.core;
  }; 

  return r; 
});

