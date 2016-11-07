function timeFormat(timestamp) {
  var time = Date.now() - timestamp * 1000;
  time = +time <= 0 ? 0 : time;
  var second = 1000;
  var minute = 60 * second;
  var hour = 60 * minute;
  var day = 24 * hour;
  var month = 30 * day; // 模糊需求.
  var year = 12 * month;
  if (time <= second) return '刚刚';
  var list = [
    [year, '年'],
    [month, '个月'],
    [day, '天'],
    [hour, '小时'],
    [minute, '分钟'],
    [second, '秒']
  ], tmp, ret = '';
  for (var i = 0, l = list.length; i < l; ++i) {
    tmp = time / list[i][0];
    if (tmp >= 1) {
      ret = parseInt(tmp, 10) + list[i][1]
      break;
    } else {
      time = time % list[i][0]
    }
  }
  ret += '前';
  return ret;
}