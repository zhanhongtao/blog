var uis = [
  ['bt', uibt],
  ['se', uise]
];

var keys = ['index', 'count', 'display'];
var nodes = keys.reduce(function(ret, key) {
  return ret[key] = document.getElementById(key), ret;
}, {});

function createPagination() {
  var params = keys.map(function(key) {
    return Number(nodes[key].value);
  });
  uis.forEach(function(ui) {
    var node = document.getElementById(ui[0]);
    var html = ui[1].apply(null, params);
    node.innerHTML = html;
  });
}

nodes.index.oninput =
  nodes.index.onchange =
  nodes.count.oninput =
  nodes.count.onchange =
  nodes.display.onchange = createPagination

createPagination();

document.onclick = function(e) {
  var node = e.target;
  if (node.nodeName === 'A') {
    var page = node.href.replace(/\D/g, '');
    nodes.index.value = page;
    createPagination();
    return false;
  }
}
