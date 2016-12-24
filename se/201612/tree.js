
// 前序
function d(node, handle) {
  if (!node) return;
  handle(node);
  d(node.firstChild, handle);
  d(node.nextSibling, handle);
}

// 中序
function d(node, handle) {
  if (!node) return;
  d(node.firstChild, handle);
  handle(node);
  d(node.nextSibling, handle);
}

// 后续
function d(node, handle) {
  if (!node) return;
  d(node.firstChild, handle);
  d(node.nextSibling, handle);
  handle(node);
}

// 广度
function d(node, handle) {
  if (!node || node.length == 0) return;
  if (Object.prototype.toString.call(node) !== '[object Array]') {
    node = [node];
  }
  var children = [];
  for (var i = 0; i < node.length; ++i) {
    handle(node[i]);
    var child = node[i].firstChild;
    while(child) {
      children.push(child);
      child = child.nextSibling;
    }
  }
  d(children, handle);
}

d(document.body, function(node) {
  if (node.nodeType == 1) {
    console.log(node);
  }
});


function walk(node, handle, context) {
  context = context || document;
  while (node && node.nodeType == 1) {
    if (handle(node) === true) {
      return node;
    }
    if (node !== context) {
      node = node.parentNode;
    }
  }
  return null;
}

document.addEventListener('click', function(e) {
  e.preventDefault();
  var selector = 'body';
  walk(e.target, function(node){
    console.log(node);
    if (node.matches(selector)) {
      return true;
    }
  });
}, true);

