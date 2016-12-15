;(function() {
var list = [];
function load(src, cb) {
  var cb = typeof cb === 'function' ? cb : function() {};
  var img = document.createElement('img');
  img.onload = function() {
    img.onerror = img.onload = null;
    cb(true);
  };
  img.onerror = function() {
    img.onerror = img.onload = null;
    cb(false);
    list.push([src, cb]);
  };
  img.src = src;
}
window.addEventListener('online', function() {
  var item, stack = list.slice(0);
  list.length = 0;
  while (item = stack.pop()) {
    load(item[0], item[1]);
  }
}, false);

window.loader = load;
}());


