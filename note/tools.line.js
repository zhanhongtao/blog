
;(function() {

  var line = Tools.line = {};
  var ctx, layer;
  line.init = function( context, canvas ) {
    ctx = context;
    initLayer( canvas );
  };

  line.destory = function() {
    layer.style.display = 'none';
  };

  line.draw = function( x0, y0, x1, y1 ) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo( x0, y0 );
    ctx.lineTo( x1, y1 );
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#faa';
    ctx.stroke();
    ctx.restore();
  };

  function initLayer( canvas ) {
    if ( layer ) return layer.style.display = 'block';
    layer = document.createElement( 'canvas' );
    canvas.parentNode.insertBefore( layer, canvas );
    layer.id = 'line-help';
    layer.width = canvas.width;
    layer.height = canvas.height;
    var context = layer.getContext('2d');
    bindEvents( context );
  }

  function bindEvents( ctx ) {

    var isMouseDown = false;
    var point = {};
    function mousedown(e) {
      isMouseDown = true;
      point.x = e.pageX, point.y = e.pageY;
      layer.addEventListener( 'mousemove', mousemove, false );
      layer.addEventListener( 'mouseup', mouseup, false );
    }

    function mousemove(e) {
      if ( isMouseDown ) {
        draw( e.pageX, e.pageY );
      }
    }

    function mouseup(e) {
      line.draw( point.x, point.y, e.pageX, e.pageY );
      ctx.clearRect( 0, 0, canvas.width, canvas.height );
      layer.removeEventListener( 'mousemove', mousemove, false );
      layer.removeEventListener( 'mouseup', mouseup, false );
    }

    function draw( x, y ) {
      ctx.save();
      ctx.clearRect( 0, 0, canvas.width, canvas.height );
      ctx.beginPath();
      ctx.moveTo( point.x, point.y );
      ctx.lineTo( x, y );
      ctx.strokeStyle = '#faa';
      ctx.stroke();
      ctx.restore();
    }

    layer.addEventListener( 'mousedown', mousedown, false );
  }

})( Tools );