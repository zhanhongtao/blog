
function encodeurl(url) {
  return encodeURIComponent(url);
}

function decodeurl(url) {
  return decodeURIComponent(url);
}

function encodeToGBK(url) {
  var f = document.getElementById('gbk-iframe');
  return f.contentWindow.encoding(url);
}