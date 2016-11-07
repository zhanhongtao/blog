exports.walk = function(node, handle, context) {
  while (node) {
    if (handle(node) === true) {
      return node;
    }
    if (node === context) {
      break;
    } else {
      node = node.parentNode;
    }
  }
  return null;
};
