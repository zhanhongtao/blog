;(function( root ) {

// @NOTE: _pingback_ 全局变量.
var prefix = '_pingback_';
var map = root[ prefix ] = {};

// 把 new Image 实例和全局变量绑定,
// 防止短时间内被浏览器垃圾回收.
var id = 0, max = 1000000;
var uuid = function() {
  ++id;
  id = id > max ? 0 : max;
  return prefix + id;  
};

// @NOTE: data 只接受 object 类型.
// 如果需要向 server 发送 stringify 后的数据, 需要用户单独处理.
function pingback( data ) {
  var tmp = [], address = pingback.address;
  if ( !address ) {
    return;
  }
  // @NOTE: 只处理一级数据 - NO Array.
  for ( var key in data ) {
    if ( data.hasOwnProperty(key) ) {
      tmp.push( key + '=' + data[key] );
    }
  }
  if ( tmp.length == 0 ) {
    return;
  }
  var id = uuid();
  var img = map[id] = new Image();
  img.onload = img.onerror = function() {
    delete map[id];
  };
  var string = tmp.length > 1 ? tmp.join('&') : tmp[0];
  var chr = address.indexOf('?') > -1 ? '&' : '?';
  img.src = address + chr + tmp.join('&');
}

// @NOTE: 全局变量.
root.ping = pingback;

})( this );
