
var text = 'Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n' +
    'Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.';


var getRandomInt = fabric.util.getRandomInt;
document.getElementById('add-text').onclick = function() {
  var textSample = new fabric.Text(text.slice(0, getRandomInt(0, text.length)), {
    left: getRandomInt(350, 400),
    top: getRandomInt(350, 400),
    fontFamily: 'helvetica',
    angle: getRandomInt(-10, 10),
    fill: '#' + getRandomColor(),
    scaleX: 0.5,
    scaleY: 0.5,
    fontWeight: '',
    originX: 'left',
    hasRotatingPoint: true,
    centerTransform: true
  });
  canvas.add(textSample);
};

function getRandomColor() {
  return (
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2)
  );
}

function pad(str, length) {
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

var textEl = document.getElementById('text');
if (textEl) {
  textEl.onfocus = function() {
    var activeObject = canvas.getActiveObject();

    if (activeObject && /text/.test(activeObject.type)) {
      this.value = activeObject.text;
    }
  };
  textEl.onkeyup = function(e) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (!this.value) {
        canvas.discardActiveObject();
      }
      else {
        activeObject.setText(this.value);
      }
      canvas.renderAll();
    }
  };
}

function getStyle(object, styleName) {
  return (object.getSelectionStyles && object.isEditing)
    ? object.getSelectionStyles()[styleName]
    : object[styleName];
}

function setStyle(object, styleName, value) {
  if (object.setSelectionStyles && object.isEditing) {
    var style = { };
    style[styleName] = value;
    object.setSelectionStyles(style);
  }
  else {
    object[styleName] = value;
  }
}


var fontFamilySwitch = document.getElementById('font-family');
if (fontFamilySwitch) {
  fontFamilySwitch.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      setStyle(activeObject, 'fontFamily', this.value.toLowerCase());
      canvas.renderAll();
    }
  };
}


var textAlignSwitch = document.getElementById('text-align');
if (textAlignSwitch) {
  textAlignSwitch.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      var value = this.value.toLowerCase();
      activeObject.textAlign = value;
      canvas._adjustPosition && canvas._adjustPosition(activeObject, value === 'justify' ? 'left' : value);
      canvas.renderAll();
    }
  };
}


var bgColorField = document.getElementById('text-bg-color');
if (bgColorField) {
  bgColorField.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      activeObject.backgroundColor = this.value;
      canvas.renderAll();
    }
  };
}


var bgLineColorField = document.getElementById('text-lines-bg-color');
if (bgLineColorField) {
  bgLineColorField.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      setStyle(activeObject, 'textBackgroundColor', this.value);
      canvas.renderAll();
    }
  };
}

var textFontSizeField = document.getElementById('text-font-size');
if (textFontSizeField) {
  textFontSizeField.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      setStyle(activeObject, 'fontSize', parseInt(this.value, 10));
      canvas.renderAll();
    }
  };
}

var strokeColorField = document.getElementById('text-stroke-color');
if (strokeColorField) {
  strokeColorField.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      setStyle(activeObject, 'stroke', this.value);
      canvas.renderAll();
    }
  };
}

var strokeWidthField = document.getElementById('text-stroke-width');
if (strokeWidthField) {
  strokeWidthField.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      setStyle(activeObject, 'strokeWidth', parseInt(this.value, 10));
      canvas.renderAll();
    }
  };
}

var textLineHeightField = document.getElementById('text-line-height');
if (textLineHeightField) {
  textLineHeightField.onchange = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && /text/.test(activeObject.type)) {
      activeObject.setLineHeight(parseInt(this.value, 10));
      canvas.renderAll();
    }
  };
}

var cmdBoldBtn = document.getElementById('text-cmd-bold');
  if (cmdBoldBtn) {
    cmdBoldBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && /text/.test(activeObject.type)) {

        var isBold = getStyle(activeObject, 'fontWeight') === 'bold';
        setStyle(activeObject, 'fontWeight', isBold ? '' : 'bold');

        this.className = isBold ? this.className + ' selected' : this.className.replace(' selected', '');
        canvas.renderAll();
      }
    };
  }

  var cmdItalicBtn = document.getElementById('text-cmd-italic');
  if (cmdItalicBtn) {
    cmdItalicBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && /text/.test(activeObject.type)) {

        var isItalic = getStyle(activeObject, 'fontStyle') === 'italic';
        setStyle(activeObject, 'fontStyle', isItalic ? '' : 'italic');

        this.className = isItalic ? this.className + ' selected' : this.className.replace(' selected', '');
        canvas.renderAll();
      }
    };
  }

  var cmdShadowBtn = document.getElementById('text-cmd-shadow');
  if (cmdShadowBtn) {
    cmdShadowBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && /text/.test(activeObject.type)) {

        var hasShadow = getStyle(activeObject, 'shadow');
        setStyle(activeObject, 'shadow', hasShadow ? '' : 'rgba(0,0,0,1) 10px 10px 10px');

        this.className = hasShadow ? this.className + ' selected' : this.className.replace(' selected', '');
        canvas.renderAll();
      }
    };
  }

 var cmdUnderlineBtn = document.getElementById('text-cmd-underline'),
      cmdLinethroughBtn = document.getElementById('text-cmd-linethrough'),
      cmdOverlineBtn = document.getElementById('text-cmd-overline');

  if (cmdUnderlineBtn) {
    cmdUnderlineBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && /text/.test(activeObject.type)) {

        var isUnderline = (getStyle(activeObject, 'textDecoration') || '').indexOf('underline') > -1;
        setStyle(activeObject, 'textDecoration', isUnderline ? '' : 'underline');

        // if (activeObject.textDecoration === 'underline') {
        //   this.className += ' selected';
        //   cmdLinethroughBtn.className = cmdOverlineBtn.className = 'btn';
        // }
        // else {
        //   this.className = 'btn';
        // }
        canvas.renderAll();
      }
    };
  }

  if (cmdLinethroughBtn) {
    cmdLinethroughBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && /text/.test(activeObject.type)) {

        var isLinethrough = (getStyle(activeObject, 'textDecoration') || '').indexOf('line-through') > -1;
        setStyle(activeObject, 'textDecoration', isLinethrough ? '' : 'line-through');

        // if (activeObject.textDecoration === 'line-through') {
        //   this.className += ' selected';
        //   cmdUnderlineBtn.className = cmdOverlineBtn.className = 'btn';
        // }
        // else {
        //   this.className = 'btn';
        // }
        canvas.renderAll();
      }
    };
  }

  if (cmdOverlineBtn) {
    cmdOverlineBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && /text/.test(activeObject.type)) {

        var isOverline = (getStyle(activeObject, 'textDecoration') || '').indexOf('overline') > -1;
        setStyle(activeObject, 'textDecoration', isOverline ? '' : 'overline');

        // if (activeObject.textDecoration === 'overline') {
        //   this.className += ' selected';
        //   cmdUnderlineBtn.className = cmdLinethroughBtn.className = 'btn';
        // }
        // else {
        //   this.className = 'btn';
        // }
        canvas.renderAll();
      }
    };
  }
