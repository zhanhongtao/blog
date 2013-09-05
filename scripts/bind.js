

function bind( func, context ) {
  context = context || this;
  return function() {
    return func.apply( context, arguments );
  }
}

