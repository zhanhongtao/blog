;(function() {

var nodes = [];

document.addEventListener('click', function(e) {
  e.preventDefault();
  nodes.push(e.target);
  console.log('node:', e.target);
  if (nodes.length == 2) {
    compareDocumentPosition(nodes[0], nodes[1]);
    nodes.length = 0;
  }
}, true);


function compareDocumentPosition(node, otherNode) {
  var bit = node.compareDocumentPosition(otherNode);
  var map = {
    1: '不属于同一个根节点',
    2: 'otherNode 在 node 之前',
    4: 'otherNode 在 node 之后',
    8: 'otherNode 包含 node',
    16: 'otherNode 被 node 包含',
    32: 'IMPLEMENTATION_SPECIFIC'
  };
  for (var key in map) {
    var status = (key & bit) === 0 ? 0 : 1;
    if (key & bit) {
      console.log(map[key]);
    }
  }
}

})();



