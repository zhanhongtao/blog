import extend from './extend.js'

// 遍历
function each (array, handler) {
  for (var i = 0, l = array.length; i < l; ++i) {
    try {
      handler(array[i], i, array)
    } catch (e) {
      throw (e)
    }
  }
}

// 处理单个格子样式(class-name).
function grid (data, type) {
  var config = this.config
  var list = [this.style.grid]
  var classes = config.classes
  for (var name in classes) {
    var method = classes[name]
    var classname = method.call(this, data, type)
    if (typeof classname === 'string') {
      list.push(classname)
    }
  }
  return list
}

// 修正星期显示
// start: 认为周几算第一天(0 表示周日)
// weekTextList: 星期对应文案
function fixedWeekList (start, weekTextList) {
  while (start-- > 0) {
    weekTextList.push(weekTextList.shift())
  }
}

// 修正星期索引
function fixedWeek (week) {
  return (7 + week % 7) % 7
}

// 第一天是星期几
// day: 任意某一天
// week: day 对应的星期
function firstDayOfDate (day, week) {
  day = day % 7
  while (day > 1) {
    --week
    --day
  }
  return (7 + week % 7) % 7
  // 或
  // return new Date( year, month, 1 ).getDay();
}

// 是否为闰年
function isLeapYear (year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)
}

// 指定年月, 计算当前月有多少天
// from: http://weibo.com/1401880315/EjwuPbnkz
function getDaysInMonth (year, month) {
  month = month + 1
  return (month === 2) ? (28 + isLeapYear(year)) : 31 - (month - 1) % 7 % 2
}

// 指定为 2015-01-01 格式
// 不支持 15-01-01 格式
function format (date) {
  return String(date).replace(/(?:-)(.)(?![0-9])/g, function (full, match) {
    return '-0' + match
  })
}

function toString (year, month, day) {
  if (year instanceof Date) {
    var date = year
    year = date.getFullYear()
    month = date.getMonth()
    day = date.getDate()
  }
  return format([year, month + 1, day].join('-'))
}

// 转换为统一日期格式
function toDate (year, month, day) {
  if (year instanceof Date) {
    return year
  }
  // 年月日参数
  if (arguments.length === 3) {
    year = [year, month + 1, day].join('-')
  }
  if (typeof year === 'string') {
    return new Date(format(year))
  }
  if (typeof year === 'number') {
    return new Date(toString(new Date(year)))
  }
  // 保证和时间无关
  return new Date(toString(new Date()))
}

// date 是否在给定的range([min, max])区间内
function inRange (date, range) {
  var min = range[0]
  var max = range[1]
  if (!min && !max) {
    return true
  }
  date = toDate(date)
  var bottom = min.getTime()
  var test = date.getTime()
  if (!max) {
    return test >= bottom
  }
  var top = max.getTime()
  return test >= bottom && test <= top
}

// 是否支持 prev/next
function updateState (date) {
  if (!this.config.min) {
    this.isprevday = true
    this.isprevmonth = true
    this.isprevyear = true
  }

  if (!this.config.max) {
    this.isnextday = true
    this.isnextmonth = true
    this.isnextyear = true
  }

  date = date || this.date
  var year = date.getFullYear()
  var month = date.getMonth()
  var day = date.getDate()
  var self = this
  each(['next', 'prev'], function (type) {
    var fix = type === 'next' ? 1 : -1
    each(['day', 'month', 'year'], function (item) {
      var value = calc({
        year: item === 'year' ? year + fix : year,
        month: item === 'month' ? month + fix : month,
        day: item === 'day' ? day + fix : day
      })
      self['is' + type + item] = inRange(
        toDate(value.year, value.month, value.day),
        [self.config.min, self.config.max]
      )
    })
  })
}

// @NOTE: 只修正一个值.
function calc (obj) {
  var year = obj.year
  var month = obj.month
  var day = obj.day
  var days = getDaysInMonth(year, month)
  if (day > days) {
    ++month
  } else if (day < 1) {
    --month
  }
  if (month > 11) {
    ++year
    month = 0
  } else if (month < 0) {
    --year
    month = 11
  }
  var newdays = getDaysInMonth(year, month)
  obj.year = year
  obj.month = month
  if (day <= 0) {
    day = newdays
  } else if (day > days) {
    day = 1
  }
  obj.day = day
  return obj
}

function Calendar (config) {
  var isInstance = this instanceof Calendar
  if (!isInstance) {
    return new Calendar(config)
  }
  this.refresh(config)
}

// 方便重写 render 方法.
Calendar.util = {
  extend: extend,
  each: each,
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  fixedWeek: fixedWeek,
  getDaysInMonth: getDaysInMonth,
  inRange: inRange,
  calc: calc,
  toDate: toDate,
  toString: toString
}

Calendar.prototype.refresh = function (config) {
  // 合并 config
  config = this.config = extend(true, {}, config)
  this.style = config.style

  // 调整 week 的文案顺序
  var start = this.start = config.start
  fixedWeekList(start, config.weekTextList)

  // 记录今天的日期
  this.today = toDate(config.today)

  // 记录当前日期
  // 一般和 today 同步
  // 默认: today
  this.date = this.date || toDate(config.date || this.today)

  // 高亮当前日期
  this.selected = [toString(this.date)]

  // 记录容器
  this.box = config.box

  // 更新状态
  updateState.call(this)

  return this
}

// 更新配置信息
Calendar.prototype.setConfig = function (config) {
  config = extend(true, this.config, config)
  return this.refresh(config)
}

function renderday () {
  var self = this
  var html = ''

  // 拼头部导航
  var year = this.date.getFullYear()
  var month = this.date.getMonth()
  html += '<caption>'
  html += '<a class="' + this.style.previous + '" data-action="prev-month"></a>'
  html += '<span class="' + this.style.title + '" data-action="show-month">' + year + '年' + (month + 1) + '月' + '</span>'
  html += '<a class="' + this.style.next + '" data-action="next-month"></a>'
  html += '</caption>'

  // 拼星期
  html += '<tr>'
  for (var i = 0; i < 7; ++i) {
    html += '<th>' + this.config.weekTextList[i] + '</th>'
  }
  html += '</tr>'

  // 拼格子
  this.grid(function (data) {
    var index = data.index
    if (index % 7 === 0) {
      html += '<tr>'
    }
    var date = toString(data.year, data.month, data.day)
    html += '<td data-date="' + date + '" data-week="' + data.week + '">'
    var list = grid.call(self, data, 'day')
    html += '<div class="' + list.join(' ') + '">' + data.day + '</div>'
    html += '</td>'
    if (index % 7 === 6) {
      html += '</tr>'
    }
  })
  return html
}

// 拼月份
function rendermonth () {
  var html = ''
  var year = this.date.getFullYear()
  var day = this.date.getDate()
  html += '<caption>'
  html += '<a class="' + this.style.previous + '" data-action="prev-year"></a>'
  html += '<span class="' + this.style.title + '" data-action="show-year">' + year + '年' + '</span>'
  html += '<a class="' + this.style.next + '" data-action="next-year"></a>'
  html += '</caption>'
  html += '<tr>'
  for (var i = 1, l = 12; i <= l; ++i) {
    var date = toString(year, i - 1, day)
    html += '<td data-date="' + date + '">'
    var list = grid.call(this, {
      year: year,
      month: i - 1,
      day: day
    }, 'month')
    html += '<div class="' + list.join(' ') + '">' + i + '</div>'
    html += '</td>'
    if (i % 4 === 0) {
      html += '</tr>'
      if (l > i) {
        html += '<tr>'
      }
    }
  }
  return html
}

// 年需要变范围
function renderyear () {
  var html = ''
  var year = this.viewyear || this.date.getFullYear()
  var month = this.date.getMonth()
  var day = this.date.getDate()
  // 拼头部导航
  html += '<caption>'
  html += '<a class="' + this.style.previous + '" data-action="prev-view-year"></a>'
  html += '<span class="' + this.style.title + '">' + (year - 5) + '年 - ' + (year + 6) + '年</span>'
  html += '<a class="' + this.style.next + '" data-action="next-view-year"></a>'
  html += '</caption>'
  html += '<tr>'
  for (var i = 1, l = 12; i <= l; ++i) {
    var date = toString(year - 6 + i, month, day)
    html += '<td data-date="' + date + '">'
    var list = grid.call(this, {
      year: year - 6 + i,
      month: month,
      day: day
    }, 'year')
    html += '<div class="' + list.join(' ') + '">' + (year - 6 + i) + '</div>'
    html += '</td>'
    if (i % 4 === 0) {
      html += '</tr>'
      if (l > i) {
        html += '<tr>'
      }
    }
  }
  return html
}

Calendar.prototype.render = function (type) {
  updateState.call(this)
  type = type || 'day'
  if (type !== 'year') this.viewyear = null
  var html = '<table class="' + this.style[type + '-view'] + '">'
  this.viewtype = type
  switch (type) {
    case 'year':
      html += renderyear.call(this)
      break
    case 'month':
      html += rendermonth.call(this)
      break
    case 'day':
      html += renderday.call(this)
      break
    default:
      break
  }
  html += '</table>'
  this.box.innerHTML = html
  return this
}

// 处理单个 grid 显示
Calendar.prototype.grid = function (func) {
  var date = this.date
  var theWeekOfFirstDay = firstDayOfDate(
    date.getDate(),
    date.getDay()
  )
  var index = 0
  var paddingDays = (7 - this.start + theWeekOfFirstDay) % 7

  // 初始化
  // 记录当前屏, 显示的日期
  this.views = this.views || []
  this.views.length = 0

  // 需要补充格子 - 上个月日期
  if (paddingDays) {
    var _date = calc({
      year: date.getFullYear(),
      month: date.getMonth() - 1,
      day: 1
    })
    var days = getDaysInMonth(_date.year, _date.month) - paddingDays
    var week = this.start
    while (paddingDays > 0) {
      func({
        year: _date.year,
        month: _date.month,
        day: ++days,
        week: fixedWeek(week++),
        index: index++,
        current: false
      })
      --paddingDays
    }
  }

  // 当月格子.
  var year = date.getFullYear()
  var month = date.getMonth()
  var days = getDaysInMonth(year, month)
  var week = theWeekOfFirstDay
  var i = 1
  while (i <= days) {
    func({
      year: year,
      month: month,
      day: i++,
      week: fixedWeek(week++),
      index: index++,
      current: true
    })
  }

  // 补充格子 - 下个月.
  if (index % 7 !== 0) {
    var _date = calc({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: 1
    })
    var i = 1
    while (index % 7 !== 0) {
      func({
        year: _date.year,
        month: _date.month,
        day: i++,
        week: fixedWeek(week++),
        index: index++,
        current: false
      })
    }
  }
}

each(['next', 'prev'], function (prefix) {
  each(['year', 'month', 'day'], function (type) {
    var _type = type.charAt(0).toUpperCase() + type.slice(1)
    var method = prefix + _type
    Calendar.prototype[method] = Calendar.util[method] = function (date) {
      if (date) {
        date = toDate(date)
      }
      date = date || this.date
      var obj = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      }
      obj[type] = obj[type] + (prefix === 'next' ? 1 : -1)
      var ret = calc(obj)
      var value = toDate(ret.year, ret.month, ret.day)
      if (this instanceof Calendar) {
        this.date = value
        return this
      }
      return value
    }
  })
})

Calendar.prototype.changeyearview = function (view) {
  this.viewyear = this.viewyear || this.date.getFullYear()
  this.viewyear += view * 12
  this.render('year')
}

Calendar.prototype.goto = function (date) {
  date = toDate(date)
  this.date = date
  this.selected = [toString(date)]
  updateState.call(this)
  return this
}

Calendar.prototype.get = function () {
  return this.selected
}

Calendar.prototype.show = function () {
  this.date = toDate(this.selected[0] || this.config.date || this.today)
  this.box.style.display = 'block'
  this.visible = true
  return this.render()
}

Calendar.prototype.hide = function () {
  this.box.style.display = 'none'
  this.visible = false
  return this
}

export {
  Calendar
}
