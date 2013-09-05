

var bind = Function.prototype.bind || function ( func, context ) {
    context = context || this;
    return function() {
      return func.apply( context, arguments );
    }
};

