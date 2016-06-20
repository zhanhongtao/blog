function render(cfg, db) {
  // 对 vector 进行一次修正
  var vector = (function(vector) {
    var list = [];
    for (var i = 0, l = vector.length; i < l; ++i) {
      var item = vector[i];
      if (item.key && item.value.length > 0) {
        list.push(item);
      }
    }
    return list;
  })(cfg.vector);

  var other = cfg.other;

  // 对头信息做排序 - 不稳定排序
  // 实现从少到多排序.
  vector.sort(function(a, b) {
    return a.value.length > b.value.length;
  });

  var header = vector.concat(other);
  // 生成表头信息
  var html  = '<table>';
  html += '<head><tr>';
  for (var i = 0, l = header.length; i < l; ++i) {
    html += '<th>' + header[i].name + '</th>'
  }
  html += '<tr></head>';

  // 生成主题部分
  html += '<tbody>';

  // 依赖后面列, 计算行数
  function calcRowsInTd(vector, j) {
    var ret = 1;
    for (; j < vector.length; ++j) {
      ret *= vector[j].value.length;
    }
    return ret;
  }

  // 计算各个单元格需占行数
  var cache = (function(vector) {
    var cache = [];
    for (var i = 0, l = vector.length; i < l; ++i) {
      cache[i] = calcRowsInTd(vector, i + 1);
    }
    return cache;
  })(vector);

  // 计算当前单元格内容
  function getText(i, j, max) {
    var index = Math.floor(i / max);
    var list = vector[j].value;
    return list[index % list.length];
  }

  // 根据条件过滤 db, 并取出 key 对应 value 值.
  function filterData(db, condition, key) {
    var row;
    for (var i = 0, l = db.length; i < l; ++i) {
      row = db[i];
      var is = true;
      for (var p in condition) {
        if (condition.hasOwnProperty(p)) {
          if (condition[p] !== row[p]) {
            is = false;
            break;
          }
        }
      }
      if (is) {
        break;
      }
    }
    return is ? row[key] : null;
  }

  function updateDB(db, condition, key, value) {
    console.log(condition, key, value);
    // config.update()
  }

  // 根据行, 找到各个字段
  function calcCondition(row, vector) {
    var filter = {};
    // 查找列
    for (var i = 0, l = vector.length; i < l; ++i) {
      var item = vector[i];
      var values = item.value;
      var index = Math.floor(row / cache[i]) % values.length;
      filter[item.key] = values[index];
    }
    return filter;
  }

  // 根据配置访问数据
  function getValue(row, col, vector, db) {
    var filter = calcCondition(row, vector);
    var key = other[col - vector.length].key;
    var value = filterData(db, filter, key);
    return '<input value="' + (value || '') + '" />';
  }

  // 计算表格一共多少行
  var rows = calcRowsInTd(vector, 0);

  // 生成行
  for (var i = 0; i < rows; ++i) {
    html += '<tr>';
    // 生成列
    for (var j = 0; j < vector.length; ++j) {
      var tmp = cache[j];
      if (i % tmp == 0) {
        html += '<td rowspan="' + tmp + '">';
        html += getText(i, j, tmp);
        html += '</td>'
      }
    }
    // 生成必要内容
    for (var k = 0; k < other.length; ++k) {
      html += '<td data-row="' + i + '" data-col="' + (j + k) + '">';
      html += getValue(i, j + k, vector, db)
      html += '</td>';
    }
    html += '</tr>';
  }

  html += '</tbody>';
  html += '</table>';

  if (config.editable) {
    $(document).on('change', 'table input', function(e) {
      var data = $(this).closest('td').data();
      var filter = calcCondition(data.row, vector);
      var key = other[data.col - vector.length];
      var value = $.trim(this.value);
      if (value) {
        updateDB(db, filter, key, value);
      }
    });
  }

  return html;
}