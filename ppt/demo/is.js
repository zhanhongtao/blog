
;(function() {

  var is = this.is = {};
  
  function type(s) {
    return Object.prototype.toString.call(s).slice(8, -1).toLowerCase();
  }
  
  function each( obj, handle ) {
    if ( type(obj) === 'object' ) {
      for ( var key in obj ) {
        if ( false === handle(obj[key], key, obj) ) {
          break;
        }
      }
    } else {
      for ( var i = 0, l = obj.length; i < l; ++i ) {
        if ( false === handle(obj[i], i, obj) ) {
          break;
        }
      }
    }
  }
  
  each( [ 'string', 'number', 'array', 'object', 'function', 'undefined', 'regexp', 'date' ], function(method) {
    is[method] = function( s ) {
      return type(s) === method;
    };
  });
  
  is.NaN = function(s) {
    return type(s) === 'number' && isNaN(s)
  };
  
  // is.email
  // is.mobile
  // is.weixin
  // is.browser
  // is.leapYear
  
})();

