// 对 vector 进行修正和排序(策略)
function fixedVector(vector) {
  var list = [];
  for (var i = 0, l = vector.length; i < l; ++i) {
    var item = vector[i];
    if (item.key && item.value.length > 0) {
      list.push(item);
    }
  }
  return list.sort(function(a, b) {
    return a.value.length > b.value.length;
  });
}

function X(cfg, db, root) {
  this.db = db || [];
  this.vector = fixedVector(cfg.vector);
  this.other = cfg.other || [];
  this._calcHelper();
  this._auto_id = '_table_' + (new Date).getTime();
  this.root = root || document.body;
  this.grid = cfg.grid || function(v) { return v; };
  if (cfg.editable) {
    this.bind();
  }
}

X.fn = X.prototype;

X.fn.render = function() {
  var html  = '<table id="' + this._auto_id + '">';
  var vector = this.vector;
  var other = this.other;
  var keys = vector.concat(other);

  // head
  html += '<thead><tr>';
  for (var i = 0, l = keys.length; i < l; ++i) {
    html += '<th>' + keys[i].name + '</th>'
  }
  html += '<tr></thead>';
  
  // body
  html += '<tbody>';

  // 计算表格一共多少行
  var rows = this._calcRowsInTd(0);
  // 生成行
  for (var i = 0; i < rows; ++i) {
    html += '<tr>';
    // 生成列
    for (var j = 0; j < vector.length; ++j) {
      var tmp = this.cache[j];
      if (i % tmp == 0) {
        html += '<td rowspan="' + tmp + '">';
        html += this._getText(i, j, tmp);
        html += '</td>'
      }
    }
    // 生成必要内容
    for (var k = 0; k < other.length; ++k) {
      html += '<td data-row="' + i + '" data-col="' + (j + k) + '">';
      html += this.getValue(i, j + k)
      html += '</td>';
    }
    html += '</tr>';
  }

  html += '</tbody>';
  html += '</table>';
  this.root.innerHTML = html;
};

// 依赖后面列, 计算行数
X.fn._calcRowsInTd = function(i) {
  var ret = 1, vector = this.vector;
  for (; i < vector.length; ++i) {
    ret *= vector[i].value.length;
  }
  return ret;
};

// 计算各个单元格需占行数
X.fn._calcHelper = function() {
  var cache = this.cache = [];
  var vector = this.vector;
  for (var i = 0, l = vector.length; i < l; ++i) {
    cache[i] = this._calcRowsInTd(i + 1);
  }
};

// 计算当前单元格内容
X.fn._getText = function(i, j, max) {
  var index = Math.floor(i / max);
  var values = this.vector[j].value;
  return values[index % values.length];
};

// 根据条件过滤 db.
X.fn._filter = function(condition) {
  var ret, db = this.db;
  for (var i = 0, l = db.length; i < l; ++i) {
    var row = db[i], is = true;
    for (var p in condition) {
      if (condition.hasOwnProperty(p)) {
        if (condition[p] !== row[p]) {
          is = false;
          break;
        }
      }
    }
    if (is) {
      ret = row;
      break;
    }
  }
  return ret;
};

// 根据行, 找到各个字段
X.fn._calcCondition = function(row) {
  var vector = this.vector, filter = {};
  for (var i = 0, l = vector.length; i < l; ++i) {
    var item = vector[i];
    var values = item.value;
    var index = Math.floor(row / this.cache[i]) % values.length;
    filter[item.key] = values[index];
  }
  return filter;
};

X.fn.getKeyByCol = function(col) {
  var vector = this.vector.concat(this.other);
  return vector[col].key;
};

X.fn.getValue = function(row, col) {
  var cnd = this._calcCondition(row);
  var item = this._filter(cnd);
  var key = this.getKeyByCol(col);
  var ret = '';
  if (item) {
    ret = item[key] || '';
  }
  return this.grid(ret);
};

X.fn.bind = function() {
  var self = this;
  $(document).on('change', '#' + this._auto_id + ' input', function(e) {
    var data = $(this).closest('td').data();
    var cnd = self._calcCondition(data.row);
    var key = self.getKeyByCol(data.col);
    var item = self._filter(cnd);
    var value = $.trim(this.value);
    if (value) {
      if (item) {
        item[key] = value;
      } else {
        cnd[key] = value;
        self.db.push(cnd);
      }
      try {
        localStorage.table = JSON.stringify(self.db);
      } catch(e) {}
    }
  });
};

