var box = document.querySelector( 'section' );

function setrandomcolor(dom) {
  var low = 40;
  var high = 240;
  var r = Math.floor(Math.random() * (high - low) + low);
  var g = Math.floor(Math.random() * (high - low) + low);
  var b = Math.floor(Math.random() * (high - low) + low);
  dom.style.backgroundColor = 'rgba('+r+','+g+','+b+', .4)';
}

function init() {
  var divs = box.querySelectorAll('div');
  for (var i = 0, l = divs.length; i < l; i++) {
    setrandomcolor(divs[i])
  }
}

function randomSetFlexItemOrder() {
  var divs = box.querySelectorAll('div');
  var tmp = []
  for (var i = 0; i < divs.length; ++i) {
    tmp[i] = divs[i]
  }
  tmp.sort(function(a, b) {
    return Math.random() > 0.5 ? -1 : 1
  })
  for (var i = 0; i < tmp.length; ++i) {
    tmp[i].style.order = i
  }
}

function addflexitem() {
  var div = document.createElement('div')
  div.className = 'flex-item'
  setrandomcolor(div)
  box.appendChild(div)
}

function removeflexitem() {
  var node = box.lastChild
  while(node) {
    if (node.nodeType === 1) {
      box.removeChild(node)
      break
    } else {
      node = node.previousSibling
    }
  }
  if (box.lastChild) {
    box.removeChild(box.lastChild)
  }
}

document.addEventListener('click', function(e) {
  var target = e.target;
  if (target.matches('input[type=radio]')) {
    var name = target.getAttribute('name');
    box.style[name] = target.value;
    e.preventDefault()
  } else {
    switch(target.id) {
      case 'set-flex-item-order-random':
        randomSetFlexItemOrder()
      break
      case 'add-flex-item':
        addflexitem()
      break
      case 'remove-flex-item':
        removeflexitem()
      break
    }
  }
}, false);

var rangeElement = document.querySelectorAll('input[type=range]');
for (var i = 0, l = rangeElement.length; i < l; i++) {
  rangeElement[i].addEventListener('change', function() {
    var target = this;
    var name = target.getAttribute('name');
    var fix = target.dataset.fix;
    box.style[name] = target.value + (fix ? fix : '');
  });
}

init()