/*!
  n: 总页数
  m: 显示个数
  p: 当前页数
  is: 是否考虑前后...
*/
function calc(n, m, p, is) {
  p = p < 1 ? 1 : p > n ? n : p;
  var low = p, high = p;
  var k = m - 1, count = Math.floor(m/2);
  var c = count;
  while (low > 1 && c > 0 && k > 0) {
    --c;
    --low;
    --k;
  }
  while (high < n && k > 0) {
    --k;
    ++high;
  }
  while (low > 1 && k > 0) {
    --k;
    --low;
  }
  var range = [low, high];
  if (is) {
    if (low === 1 + 2) low = 2;
    if (high == n - 2) high = n - 1;
  }
  return [low, high];
}

function uibt(index, count, display) {
  var html = '';
  if (count > 1) {
    index = index < 1 ? 1 : index > count ? count : index;
    var range = calc(count, display, index, true);
    var min = range[0], max = range[1];
    // 0.
    if (index > 1) {
      html += '<li><a href="?page=' + (index - 1) + '">上一页</li>';
    }
    // 1.0
    if (min >= 1 + 1) {
      html += '<li><a href="?page=1">1</a></li>';
    }
    // 1.1
    if (min > 2) {
      html += '<li><span>...</span></li>';
    }
    // 2.
    while(min <= max) {
      if (min !== index) {
        html += '<li><a href="?page=' + min + '">' + min + '</a></li>';
      } else {
        html += '<li>' + min + '</li>';
      }
      ++min;
    }
    // 3.0
    if (max + 1 < count) {
      html += '<li><span>...</span></li>';
    }
    // 3.1
    if (max + 1 <= count) {
      html += '<li><a href="?page=' + count + '">' + count + '</a></li>';
    }
    // 4.
    if (index < count) {
      html += '<li><a href="?page=' + (index + 1) + '">下一页</a></li>';
    }
  }
  return html;
}

function uise(index, count, display) {
  var html = '';
  if( count > 1) {
    index = index < 1 ? 1 : index > count ? count : index;
    var range = calc(count, display, index);
    var low = range[0], high = range[1];
    if (index > 1) {
      html += '<li><a href="?page=' + (index - 1) + '">上一页</a></li>';
    }
    while (low <= high) {
      link = low == index ? low : '<a href="?page=' + low + '">' + low + '</a>';
      html += '<li>' + link + '</li>';
      ++low;
    }
    if (index < count) {
      html += '<li><a href="?page=' + (index + 1) + '">下一页</a></li>';
    }
  }
  return html;
}
