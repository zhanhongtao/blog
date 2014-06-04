
/*
  @todo:
  * canvas 层位置 resize 时调整.
  * canvas 主图片如何处理.
  * 缩放等操作是否显示.
  * 处理浏览器支持程度.
*/


/*
  事件支持:
  mouse:down
  mouse:move
  mouse:up

  object:moving
  object:scaling
  object:rotating
  object:selected
  object:modified

  after:render
*/

var canvas = new fabric.Canvas('c');
var body = document.querySelector( 'body' );

function addImageLayer( src ) {
  // 远程图片.
  fabric.Image.fromURL( src, function( oImg ) {
    oImg.set( 'originX', 'left' );
    oImg.set( 'originY', 'top' );
    // @todo: 计算图片的显示尺寸.
    canvas.add( oImg );
  });
}

function removeSelectedLayer() {
  var activeObject = canvas.getActiveObject();
  var activeGroup = canvas.getActiveGroup();
  if ( activeGroup ) {
    var objectsInGroup = activeGroup.getObjects();
    canvas.discardActiveGroup();
    objectsInGroup.forEach(function(object) {
      canvas.remove(object);
    });
  }
  else if ( activeObject ) {
    canvas.remove(activeObject);
  }
}

function save( type ) {
  var ret;
  type == null || ( type = 'image' );
  switch( type ) {
    case 'image':
      ret = canvas.toDataURL( 'png' );
      break;
    case 'svg':
      ret = canvas.toSVG();
      break;
    case 'json':
      ret = JSON.stringify(canvas);
    default:
      break;
  }
  return ret;
}

function clear( cb ) {
  canvas.clear();
  if ( typeof cb == 'function' ) {
    cb();
  }
}

function toggleLockHorizontal( bool ) {
  var activeObject = canvas.getActiveObject();
  if ( activeObject ) {
    activeObject.lockMovementX = bool == null ? !activeObject.lockMovementX : !!bool;
  }
}

function toggleLockVertical( bool ) {
  var activeObject = canvas.getActiveObject();
  if ( activeObject ) {
    activeObject.lockMovementY = bool == null ? !activeObject.lockMovementY : !!bool;
  }
}

function toggleLockScaleX( bool ) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockScalingX = bool == null ? !activeObject.lockScalingX : !!bool;
    }
}

function toggleLockScaleY( bool ) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockScalingY = bool == null ? !activeObject.lockScalingY : !!bool;
    }
}

// 调整 z-index.
function sendBackwards() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.sendBackwards(activeObject);
  }
}

function sendToBack() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.sendToBack(activeObject);
  }
}

function bringFroward() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.bringForward(activeObject);
  }
}

function bringToFront() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.bringToFront(activeObject);
  }
}

// 效果
function setShadow( offsetX, offsetY, blur, color ) {
  var obj = canvas.getActiveObject();
  if (!obj) return;

  if (obj.shadow) {
    obj.shadow = null;
  }
  else {
    obj.setShadow({
      color: color,
      blur: blur,
      offsetX: offsetX,
      offsetY: offsetY
    });
  }
  canvas.renderAll();
}

// 仅使用圆.
function setClip() {
  var obj = canvas.getActiveObject();
  if (!obj) return;

  if (obj.clipTo) {
    obj.clipTo = null;
  }
  else {
    var radius = obj.width < obj.height ? (obj.width / 2) : (obj.height / 2);
    obj.clipTo = function (ctx) {
      ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
    };
  }
  canvas.renderAll();
}

// 开启/关闭编辑模式
function toggleEditPattern( bool ) {
  canvas.isDrawingMode = bool == null ? !canvas.isDrawingMode : !!bool;
}

// 更新当前对象透明度
function updateOpacity( opacity ) {
  var activeObject = canvas.getActiveObject(),
      activeGroup = canvas.getActiveGroup();
  if (activeObject || activeGroup) {
    (activeObject || activeGroup).setOpacity( opacity / 100 );
    canvas.renderAll();
  }
}

// 更新前景色.
function updateColor( color ) {
  var activeObject = canvas.getActiveObject(),
      activeGroup = canvas.getActiveGroup();

  if (activeObject || activeGroup) {
    (activeObject || activeGroup).setFill( color );
    canvas.renderAll();
  }
}


