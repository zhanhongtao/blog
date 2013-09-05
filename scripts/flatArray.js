// 依赖 type.js
// 函数递归.
function flatArray( array ) {
  var result = [];
  for ( var i = 0, l = array.length; i < l; i++ ) {
    var current = array[i];
    result = result.concat( type(current) === 'array' ? flatArray(current) : current );
  }
  return result;
}

