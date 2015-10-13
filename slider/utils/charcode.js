
var CHARCODE = {
  before: 'String.fromCharCode(',
  after: ')',
  s: ','
};

function encodecharcode(string) {
  var tmp = string.trim().split('');
  var ret = '';
  for (var i = 0, l = tmp.length; i < l; ++i) {
    tmp[i] = tmp[i].charCodeAt(0);
  }
  ret = CHARCODE.before + tmp.join(CHARCODE.s) + CHARCODE.after;
  return ret;
}

function decodecharcode(string) {
  string = string.trim();
  var b = string.indexOf(CHARCODE.before) === 0;
  string = string.slice(CHARCODE.before.length);
  var a = string[string.length - 1] === CHARCODE.after;
  string = string.slice(0, -1);
  var tmp = string.split(CHARCODE.s);
  var ret = '';
  for (var i = 0, l = tmp.length; i < l; ++i) {
    tmp[i] = String.fromCharCode(tmp[i]);
  }
  ret = tmp.join('');
  return ret;
}

