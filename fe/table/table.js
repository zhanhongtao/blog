var config = {
  vector: {
    color: ['红色', '蓝色', '黑色'],
    size: [20, 30, 40, 50],
    functions: ['a', 'b', 'c']
  },
  other: ['key', 'value']
};

var vector = config.vector;
var other = config.other;

// 对头信息做排序 - 不稳定排序
// 实现从少到多排序.
function orderVectorKey(vector) {
  var list = [];
  for (var key in vector) {
    if (vector.hasOwnProperty(key)) {
      list.push(key);
    }
  }
  list.sort(function(a, b) {
    return vector[a].length > vector[b].length;
  });
  return list;
}

var list = orderVectorKey(vector);

var header = list.concat(other);

// 生成表头信息
var html  = '<table>';
html += '<head><tr>';
for (var i = 0, l = header.length; i < l; ++i) {
  html += '<th>' + header[i] + '</th>'
}
html += '<tr></head>';

// 生成主题部分
html += '<tbody>';

// 依赖后面列, 计算行数
function calculate(list, j) {
  var p, ret = 1;
  for (; j < list.length; ++j) {
    p = list[j];
    ret *= vector[p].length;
  }
  return ret;
}

// 计算表格一共多少行
var rows = calculate(list, 0);

// 计算各个单元格需占行数
var cache = list.map(function(key, i) {
  return calculate(list, i + 1);
});

// 计算当前单元格内容
function getProperty(i, j, max) {
  var index = Math.floor(i / max);
  return  vector[list[j]][index % vector[list[j]].length];
}

// 根据配置访问数据
function getValue(key, vector) {
  return '<input />'
}

// 生成行
for (var i = 0; i < rows; ++i) {
  html += '<tr>';
  // 生成列
  var vectorProperty = [];
  for (var j = 0; j < list.length; ++j) {
    var tmp = cache[j];
    if (i % tmp == 0) {
      html += '<td rowspan="' + tmp + '">';
      html += getProperty(i, j, tmp);
      html += '</td>'
    }
    var t = getProperty(i, j, cache[j]);
    vectorProperty.push(t);
  }
  // 生成必要内容
  for (var k = 0; k < other.length; ++k) {
    html += '<td>';
    html += getValue(other[k], vectorProperty);
    html += '</td>';
  }
  html += '</tr>';
}

html += '</tbody>';
html += '</table>'

var node = document.querySelector('#table');
node.innerHTML = html;
