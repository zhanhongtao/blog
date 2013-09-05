// wait 时间内, 只执行最后一次调用.
// ex:
// * 按钮多次点击, 只执行最后一次 - 创建快捷方式
// * 事件多次触发, 只需处理一次 - tab->update, pagezoomchanged
// * sogou image search - http://pic.sogou.com [其它图片搜索结果页类似]
// * window7 状态栏显示缩略窗口
// * tips hover 上停止 100ms 后, 显示帮助
// * hover 切换 tab.
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
