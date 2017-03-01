function Table (cfg, db, root) {
  // 是否为重复表格 - ex: 多店情况..
  this.multiple = !!cfg.multiple
  this.vector = Table.fixedVector(cfg.vector)

  // 缓存表 - 基于 vector
  var table = this.table = []
  var map = this.map = {}
  var c = this.vector
  var index = 0
  for (var i = 0, l = c.length; i < l; ++i) {
    var vc = c[i]
    for (var j = 0, n = vc.values.length; j < n; ++j) {
      map[vc.values[j]] = index++
    }
  }

  var cols = table.cols = c[0].values.length
  for (var i = 1, l = c.length; i < l; ++i) {
    var rows = c[i].values.length
    for (var row = 0; row < rows; ++row) {
      var line = table[table.length] = []
      line.down = row
      line.up = rows - row - 1
      for (var col = 0; col < cols; ++col) {
        line[col] = 0
      }
    }
    cols += rows
  }

  // 计算 vector 中属性值需占行数 -> 生成表格时使用.
  var cache = this.cache = []
  for (var k = 0, n = this.vector.length; k < n; ++k) {
    cache[k] = this.calcRowspan(k + 1)
  }
  // 对属性做额外补充
  // @todo.
  // 当编辑 other 字段时, 添加校验
  // ex: 格式/和其它条目冲突
  this.other = cfg.other || []
  this.db = db || []
  this.root = root || document.body
  // 生成单元格函数 -> 方便自定义
  this.grid = cfg.grid || function (v) {
    return v
  }

  // 初始化 table.
  for (var i = 0, l = this.db.length; i < l; ++i) {
    var item = this.db[i]
    this.write(item)
  }
}

// 对 vector 进行修正和排序(策略)
Table.fixedVector = function (vector) {
  // 过滤 value 为空的情况
  function swap (list, i, j) {
    if (i !== j) {
      var tmp = list[i]
      list[i] = list[j]
      list[j] = tmp
    }
  }
  for (var i = 0, l = vector.length; i < l; ++i) {
    var item = vector[i]
    // 过滤属性值为空情况
    if (item.values.length === 0) {
      swap(vector, i--, --l)
    } else {
      var k = i
      while (k > 0) {
        var a = vector[k - 1]
        var c = vector[k]
        if (
          // c 优先排
          (c.most && !a.most) ||
          // a/c 都不优先排，比较长度
          (!c.most && !a.most && c.values.length < a.values.length)
        ) {
          swap(vector, k, k - 1)
        } else {
          break
        }
        --k
      }
    }
  }
  vector.length = l
  return vector
}

Table.escapehtml = function (string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2f;',
    '\\': '&#x5c;',
    '%': '&#x0025;'
  }
  return String(string).replace(/[&<>"'/\\%]/g, function (key) {
    return entityMap[key]
  })
}

Table.createVector = function (row, vector, cache) {
  var ret = {}
  for (var i = 0, l = vector.length; i < l; ++i) {
    var item = vector[i]
    var values = item.values
    var index = Math.floor(row / cache[i]) % values.length
    ret[item.name] = values[index]
  }
  return ret
}

Table._keys = function (vector, map) {
  var keys = []
  for (var key in vector) {
    keys.push(map[vector[key]])
  }
  return keys.sort()
}

// 基本类型
// key/value
Table.isEqual = function (a, b) {
  if (a === b) return true
  if (typeof a === typeof b && typeof a === 'object') {
    var equal = true
    var key
    for (key in a) {
      if (b[key] !== a[key]) {
        equal = false
        break
      }
    }
    if (equal) {
      for (key in b) {
        if (a[key] !== b[key]) {
          equal = false
          break
        }
      }
    }
    return equal
  }
  return false
}

Table.findSameRow = function (rows, row, multiple) {
  var group = rows / multiple
  var index = row % group
  var list = []
  for (var i = 0; i < multiple; ++i) {
    list.push(index + i * group)
  }
  return list
}

Table.fn = Table.prototype

// 依赖后面列, 计算行数
Table.fn.calcRowspan = function (i) {
  var ret = 1
  var vector = this.vector
  for (; i < vector.length; ++i) {
    ret *= vector[i].values.length
  }
  return ret
}

// 计算当前单元格内容
Table.fn.getText = function (i, j, max) {
  var index = Math.floor(i / max)
  var texts = this.vector[j].texts
  var values = this.vector[j].values
  return Table.escapehtml(
    (texts || values)[index % values.length]
  )
}

Table.fn.render = function () {
  var html = '<table>'
  var vector = this.vector
  var other = this.other
  var keys = vector.concat(other)

  // head
  html += '<thead><tr>'
  for (var i = 0, l = keys.length; i < l; ++i) {
    html += '<th>' + Table.escapehtml(keys[i].name) + '</th>'
  }
  html += '</tr></thead>'

  // body
  html += '<tbody>'

  // 计算表格一共多少行
  var rows = this.calcRowspan(0)
  // 生成行
  for (i = 0; i < rows; ++i) {
    html += '<tr>'
    // 生成列
    for (var j = 0; j < vector.length; ++j) {
      var rowspan = this.cache[j]
      if (i % rowspan === 0) {
        html += '<td rowspan="' + rowspan + '">'
        html += this.getText(i, j, rowspan)
        html += '</td>'
      }
    }

    var item = this.table[
      Table._keys(
        Table.createVector(i, this.vector, this.cache), this.map
      ).join('-')
    ]

    for (var k = 0; k < other.length; ++k) {
      var key = other[k].key
      html += '<td data-row="' + i + '" data-col="' + (j + k) + '" data-key="' + Table.escapehtml(key) + '">'
      html += this.grid(item ? item[key] : '', item)
      html += '</td>'
    }
    html += '</tr>'
  }

  html += '</tbody>'
  html += '</table>'
  this.root.innerHTML = html
}

// 指定的 key 是否全部没数据
Table.fn.isEmpty = function (key) {
  for (var i = 0, l = this.db.length; i < l; ++i) {
    var item = this.db[i]
    if (item[key]) {
      return false
    }
  }
  return true
}

Table.fn.write = function (item) {
  var keys = Table._keys(item.vector, this.map)
  for (var l = keys.length; --l > 0;) {
    var i = keys[l] - this.table.cols
    var line = this.table[i]
    for (var j = l; --j >= 0;) {
      line[keys[j]] = 1
    }
  }
  this.table[keys.join('-')] = item
}

Table.fn.read = function (vector, select) {
  var base = this.table.cols
  var max = this.table.length + base
  // 收集各个点
  var points = vector ? Table._keys(vector, this.map) : [max - 1]
  // 初始化为 0
  var map = {}
  for (var i = 0; i < max; ++i) map[i] = 0
  var l = points.length
  for (i = 0; i < l; ++i) {
    var point = points[i]
    var col = point
    // 向左
    var array
    var length
    var from = 0
    if (point < base) {
      while (from < point) {
        map[from++] = -1
      }
    } else {
      array = this.table[point - base]
      length = array.length
      while (from < point) {
        if (map[from] !== -1) {
          map[from] = from < length
            ? (array[from] === 1 ? 1 : -1) : -1
        }
        ++from
      }
    }
    // 向下
    from = point
    while (from < max) {
      if (from < base) {
        if (map[from] !== -1) map[from] = -1
      } else {
        array = this.table[from - base]
        length = array.length
        if (map[from] !== -1) {
          map[from] = col < length
            ? (array[col] === 1 ? 1 : -1) : -1
        }
      }
      ++from
    }
  }
  i = 0
  for (i = 0; i < l; ++i) map[points[i]] = 1
  if (select != null) {
    point = this.map[select]
    if (point < base) {
      for (i = 0; i < base; ++i) map[i] = 1
    } else {
      array = this.table[point - base]
      var down = array.down
      var up = array.up
      var j = 0
      var k = 0
      while (1) {
        if (j >= down && k >= up) break
        if (j++ < down) {
          map[point - j] = 1
        }
        if (k++ < up) {
          map[point + k] = 1
        }
      }
    }
  }
  var ret = []
  for (var key in map) {
    if (map[key] === 1) {
      ret.push(key)
    }
  }
  return ret
}

// @remove.
// 根据行, 找到各个字段 -> vector
// ignore -> 是否忽略 multiple
// reverse -> 过滤时, 取反
Table.fn.createQuery = function (row, ignore, reverse) {
  var vector = this.vector
  var query = {
    reverse: !!reverse,
    vector: {}
  }
  for (var i = this.multiple && ignore ? 1 : 0, l = vector.length; i < l; ++i) {
    var item = vector[i]
    var values = item.values
    var index = Math.floor(row / this.cache[i]) % values.length
    query.vector[item.name] = values[index]
  }
  return query
}

// @remove
// 根据条件过滤 db.
// 支持 reverse 反转过滤 -> 检测冲突
Table.fn.query = function (condition) {
  var ret = []
  var db = this.db
  var reverse = !!condition.reverse
  for (var i = 0, l = db.length; i < l; ++i) {
    var row = db[i]
    var is = true
    for (var p in condition) {
      if (p !== 'reverse') {
        if (!Table.isEqual(condition[p], row[p])) {
          is = false
          break
        }
      }
    }
    if (reverse !== is) {
      ret.push(row)
    }
  }
  return ret
}

Table.fn.update = function (key, values) {
  var i = 0
  var l = this.calcRowspan(this.multiple ? 1 : 0)
  if (typeof values !== 'object') {
    var t = values
    values = []
    while (i < l) {
      values[i++] = t
    }
  }
  for (i = 0; i < l; ++i) {
    this.sync(i, key, values[i])
  }
}

Table.fn.sync = function (row, key, value) {
  var query = this.createQuery(row, true)
  var list = this.query(query)
  // 存在, 直接更新
  if (list.length) {
    for (var i = 0, l = list.length; i < l; ++i) {
      list[i][key] = value
    }
  } else {
    // 不存在, 创建
    var tmp
    if (this.multiple) {
      var b = this.vector[0]
      for (var k = 0, n = b.values.length; k < n; ++k) {
        tmp = {
          vector: query.vector
        }
        tmp[key] = value
        tmp[b.key] = b.values[k]
        this.db.push(tmp)
      }
    } else {
      tmp = {
        vector: query.vector
      }
      tmp[key] = value
      this.db.push(tmp)
    }
  }
  var rows = this.calcRowspan(0)
  var someRows = Table.findSameRow(rows, row, this.multiple ? this.vector[0].values.length : 1)
  var rowNodes = this.root.getElementsByTagName('tr')
  for (var j = 0; j < someRows.length; ++j) {
    var rowNode = rowNodes[someRows[j] + 1]
    var colNode = rowNode.querySelector('[data-key="' + key + '"]')
    colNode.innerHTML = this.grid(value)
  }
}
