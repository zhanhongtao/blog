
var storage = {}
var STORAGE_PREFIX = '_STORAGE_PREFIX_';
storage.set = function(key, value) {
  try {
    value = JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch(e) {}
};

storage.get = function(key) {
  var ret = localStorage.getItem(STORAGE_PREFIX + key);
  try {
    ret = JSON.parse(ret);
  } catch(e) {}
  return ret;
};

storage.remove = function(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
};

storage.clear = function() {
  localStorage.clear();
};

