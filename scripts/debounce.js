// wait 时间内, 只执行最后一次调用.
// ex:
// * 按钮多次点击, 只执行最后一次 - 创建快捷方式
// * 事件多次触发, 只需处理一次 - tab->update, pagezoomchanged
// * blur 和 button 同时执行 save 操作.
function debounce( func, wait ) {
  var old = new Date;
  var func = typeof func === 'function' ? func : function() {};
  var timer;
  function ret() {
    if ( timer ) {
      clearTimeout( timer );
      timer = null;
    }
    var argus = arguments;
    timer = setTimeout(function() {
      timer = null;
      func.apply( null, argus );
    }, wait);
    return ret;
  };
  return ret;
}

