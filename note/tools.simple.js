
;(function( namespace ) {

  var simple = namespace.simple = {};

  var x, y, ctx;
  simple.init = function( context ) {
    ctx = context;
  };

  simple.destory = function() {
    ctx = null;
  };

  function draw() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.stroke();
    ctx.restore();
  }

  simple.start = function( x0, y0 ) {
    x = x0, y = y0;
  };

  simple.stroke = function( x1, y1 ) {
    ctx.beginPath();
    ctx.moveTo( x, y );
    ctx.lineTo( x1, y1 );
    draw();
    x = x1, y = y1;
  };

  simple.end = function() {};

})( Tools );