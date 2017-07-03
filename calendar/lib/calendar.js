import extend from './extend.js'
import { formatdatetime } from './format.js'

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

// 修正星期显示
// start: 认为周几算第一天(0 表示周日)
// weekTextList: 星期对应文案
// 反转/反转/反转
function fixedWeekList (start, weekTextList) {
  while (start-- > 0) {
    weekTextList.push(weekTextList.shift())
  }
}

// 修正星期索引
function fixedWeek (week) {
  return (7 + week % 7) % 7
}

// 是否为闰年
function isLeapYear (year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)
}

// 指定年月, 计算当前月有多少天
// from: http://weibo.com/1401880315/EjwuPbnkz
function daysOfMonth (year, month) {
  return month === 2 ? (28 + isLeapYear(year)) : 31 - (month - 1) % 7 % 2
}

// year/month/day 是 year 年的第几天
function dayOfYear (year, month, day) {
  var c = 0
  for (var i = 0; i < month; i++) {
    c = c + daysOfMonth(year, i)
  }
  c = c + day
  return c
}

function dayOfWeek (year, month, day) {
  // 公历一年一月一日是星期一，所以起始值为星期日
  var w = 1
  // 公历星期值 400 年循环一次
  var y = (year - 1) % 400 + 1
  // 闰年次数
  var ly = Math.floor((year - 1) / 4)
  ly = ly - Math.floor((year - 1) / 100)
  ly = ly + Math.floor((year - 1) / 400)
  // 常年次数
  var ry = y - 1 - ly
  // 常年星期值增一
  w = w + ry
  // 闰年星期值增二
  w = w + 2 * ly
  w = w + dayOfYear(year, month, day)
  w = (w - 1) % 7 + 1
  return w
}

// 指定为 2015-01-01 格式
function paddingDate (date, y, z) {
  if (arguments.length === 0) date = formatdatetime('Y-M-D', new Date())
  if (typeof date === 'object') date = formatdatetime('Y-M-D', date)
  if (arguments.length === 3) date = date + '-' + y + '-' + z
  return String(date).replace(/(?:-)(.)(?![0-9])/g, function (full, match) {
    return '-0' + match
  })
}

// 转换为统一日期格式.
// @note: 对 month 需要做 + 1 处理.
function toDate (year, month, day) {
  if (year instanceof Date) {
    return new Date(paddingDate(year))
  }
  if (arguments.length === 0 || year === undefined || year === null) {
    return new Date(paddingDate())
  }
  if (typeof year === 'string') {
    return new Date(paddingDate(year))
  }
  if (arguments.length === 3) {
    return new Date(paddingDate(year, month, day))
  }
  if (typeof year === 'number') {
    return new Date(paddingDate(new Date(year)))
  }
}

// date 是否在给定的range([min, max])区间内
function inRange (date, range) {
  var min = range[0]
  var max = range[1]
  if (!min && !max) {
    return true
  }
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
  date = date || this.date
  var year = date.getFullYear()
  var month = date.getMonth()
  var day = date.getDate()
  var self = this
  each(['next', 'prev'], function (action) {
    var fix = action === 'next' ? 1 : -1
    each(['day', 'month', 'year'], function (name) {
      var value = calc(
        name === 'year' ? year + fix : year,
        name === 'month' ? month + fix : month,
        name === 'day' ? day + fix : day,
        name[0]
      )
      self['cando' + action + name] = inRange(
        toDate(value.year, value.month + 1, value.day),
        [self.config.min, self.config.max]
      )
    })
  })
}

// 修正在 next/prev 时, 月/日超过边界情况
// 月的变化 -> 引起日的变化
// 日的变化 -> 引起月的变化 -> 引起日的变化...
function calc (year, month, day, type) {
  var days = 0
  if (type === 'm') {
    if (month > 11) {
      ++year
      month = 0
    } else if (month < 0) {
      --year
      month = 11
    }
    days = daysOfMonth(year, month + 1)
    if (day > days) {
      day = 1
    }
  }

  if (type === 'd') {
    days = daysOfMonth(year, month + 1)
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
    if (day <= 0) {
      day = daysOfMonth(year, month + 1)
    } else if (day > days) {
      day = 1
    }
  }

  return {
    year: year,
    month: month,
    day: day
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

export function calendar (config) {
  var isInstance = this instanceof calendar
  if (!isInstance) {
    return new calendar(config)
  }
  this.refresh(config)
}

// 方便重写 render 方法.
export let utils = {
  extend: extend,
  isLeapYear: isLeapYear,
  dayOfWeek: dayOfWeek,
  daysOfMonth: daysOfMonth,
  formatdatetime: formatdatetime,
  inRange: inRange,
  paddingDate: paddingDate,
  toDate: toDate
}

calendar.prototype.refresh = function (config) {
  // 合并 config
  config = this.config = extend(true, {}, config)
  this.style = config.style

  this.handler = config.handler || function () {}

  // 调整 week 的文案顺序
  var start = this.start = config.start
  fixedWeekList(start, config.weekTextList)

  // 记录今天的日期
  this.today = toDate(config.today)

  // 记录当前日期. 默认: today
  this.date = this.date || (config.date && toDate(config.date)) || this.today

  this.selected = this.date

  // 记录容器
  this.box = config.box

  var self = this
  each(['next', 'prev'], function (action) {
    each(['year', 'month', 'day'], function (name) {
      self['cando' + action + name] = true
    })
  })

  // 更新状态
  updateState.call(this)

  return this
}

// 更新配置信息
calendar.prototype.setConfig = function (config) {
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
    var date = paddingDate(data.year, data.month + 1, data.day)
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
    var date = paddingDate(year, i, day)
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
    var date = paddingDate(year - 6 + i, month + 1, day)
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

calendar.prototype.render = function (type) {
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
calendar.prototype.grid = function (func) {
  // 初始化
  // 记录当前屏, 显示的日期
  this.views = this.views || []
  this.views.length = 0

  // 记录已处理格子数
  var index = 0
  var date = this.date
  var year = date.getFullYear()
  var month = date.getMonth()

  var dateobj
  var days
  var week

  var theWeekOfFirstDay = dayOfWeek(year, month + 1, 1)
  var paddingDays = (7 - this.start + theWeekOfFirstDay) % 7

  // 需要补充格子 - 上个月日期
  if (paddingDays) {
    dateobj = calc(year, month - 1, 1, 'm')
    days = daysOfMonth(dateobj.year, dateobj.month + 1) - paddingDays
    week = this.start
    while (paddingDays > 0) {
      func({
        year: dateobj.year,
        month: dateobj.month,
        day: ++days,
        week: fixedWeek(week++),
        index: index++,
        current: false
      })
      --paddingDays
    }
  }

  // 当月格子.
  days = daysOfMonth(year, month + 1)
  week = theWeekOfFirstDay
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
    dateobj = calc(year, month + 1, 1, 'm')
    i = 1
    while (index % 7 !== 0) {
      func({
        year: dateobj.year,
        month: dateobj.month,
        day: i++,
        week: fixedWeek(week++),
        index: index++,
        current: false
      })
    }
  }
}

each(['next', 'prev'], function (action) {
  each(['year', 'month', 'day'], function (name) {
    var method = action + name.charAt(0).toUpperCase() + name.slice(1)
    calendar.prototype[method] = function () {
      var obj = {
        year: this.date.getFullYear(),
        month: this.date.getMonth(),
        day: this.date.getDate()
      }
      obj[name] += action === 'next' ? 1 : -1
      var ret = calc(obj.year, obj.month, obj.day, name[0])
      this.date = toDate(ret.year, ret.month + 1, ret.day)
      return this
    }
  })
})

calendar.prototype.changeyearview = function (view) {
  this.viewyear = this.viewyear || this.date.getFullYear()
  this.viewyear += view * 12
  return this.render('year')
}

calendar.prototype.set = function (date) {
  this.date = toDate(date)
  this.selected = this.date
  updateState.call(this)
  this.handler(this.date)
  return this
}

calendar.prototype.get = function (format) {
  if (format) return formatdatetime(format, this.selected)
  return this.selected
}

calendar.prototype.show = function () {
  this.date = this.selected || this.today
  this.box.style.display = 'block'
  this.visible = true
  return this.render()
}

calendar.prototype.hide = function () {
  this.box.style.display = 'none'
  this.visible = false
  return this
}
