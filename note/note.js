// 第二个项目.

var box = document.querySelector( '#box' );
var canvas = box.querySelector( '#note' );
var ctx = canvas.getContext('2d');

function noop() {}

var note;

function bindEvents() {
  var ismousedown = false;

  function mousedown(e) {
    ismousedown = true;
    note.start( e.pageX, e.pageY );
    canvas.addEventListener( 'mousemove', mousemove, false );
    canvas.addEventListener( 'mouseup', mouseup, false );
  }

  function mousemove(e) {
    if ( ismousedown ) {
      note.stroke( e.pageX, e.pageY );
    }
  }

  function mouseup(e) {
    ismousedown = false;
    note.end();
    canvas.removeEventListener( 'mousemove', mousemove, false );
    canvas.removeEventListener( 'mouseup', mouseup, false );
  }

  canvas.addEventListener( 'mousedown', mousedown, false );

  var tool = document.querySelector( '#tool' );
  tool.addEventListener( 'change', function(e) {
    initTool( this.value );
  }, false );
}

function initTool( name ) {
  if ( note ) {
    try {
      note.destory();
    } catch(e) {}
  }
  note = Tools[name || 'simple'];
  note.init( ctx, canvas );
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initTool();
  bindEvents();
}

init();

