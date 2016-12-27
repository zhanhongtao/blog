
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
function d(node, handle, payload) {
  var process = [
    {node: node, payload: payload}
  ];
  for (var i = 0; i < process.length; ++i) {
   var item = process[i]; 
   handle(item, function sync(payload) {
    for (var child = item.node.firstChild; child; child = child.nextSibling) {
      process.push({node: child, payload: payload});
    }
   });
  }
}

// up.
d(document.body, function(item, sync) {
  var node = item.node;
  if (node && node.nodeType == 1) {
    console.log(node);
  }
  sync();
});


// *
function d(node, handle) {
  if (!node) return;
  var nodes = node.getElementsByTagName('*');
  for (var i = 0; i < nodes.length; ++i) {
    handle(nodes[i]);
  }
}

d(document.body, function(node) {
  if (node.nodeType == 1) {
    console.log(node);
  }
});

// path
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

