; (function (root) {
  var weekTextList = [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六'
  ]

  function noop () { }

  // 扩展对象
  function mixin (des, src, map) {
    if (typeof des !== 'object' && typeof des !== 'function') {
      throw new TypeError('Unable to enumerate properties of ' + des)
    }
    if (typeof src !== 'object' && typeof src !== 'function') {
      throw new TypeError('Unable to enumerate properties of ' + src)
    }

    map = map || function (d, s, i, des, src) {
      // 这里要加一个des[i]，是因为要照顾一些不可枚举的属性
      if (!(des[i] || (i in des))) {
        return s
      }
      return d
    }

    if (map === true) { // override
      map = function (d, s) {
        return s
      }
    }

    for (var i in src) {
      des[i] = map(des[i], src[i], i, des, src)
      // 如果返回undefined，尝试删掉这个属性
      if (des[i] === undefined) delete des[i]
    }
    return des
  }

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
  function grid (data, classlist) {
    var config = this.config
    var list = [config.item]
    var classes = config.classes
    for (var i = 0, l = classlist.length; i < l; ++i) {
      var method = classes[classlist[i]]
      if (method) {
        var classname = method.call(this, data)
        if (typeof classname === 'string') {
          list.push(classname)
        }
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
  function getDaysInMonth (year, month) {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    // 对 2 月份特殊处理
    return month === 1 && isLeapYear(year) ? 29 : days[month]
    // 或者
    // return new Date( year, month, 0 ).getDate();
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
      return new Date(toString(year))
    }
    // 年月日参数
    if (arguments.length === 3) {
      year = [year, month + 1, day].join('-')
    }
    if (typeof year === 'string') {
      return new Date(format(year))
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
    if (!this.min) {
      this.isprevday = true
      this.isprevmonth = true
      this.isprevyear = true
    }

    if (!this.max) {
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
          [self.min, self.max]
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

  // 对外公布接口
  root.calendar = calendar

  // 默认配置
  calendar.defaultConfig = {
    // 单个 grid 的 className
    item: 'item',
    // 星期规则
    // 认为从星期几开始显示
    // 其中, 0 表示周日
    start: 0,
    today: toDate(),
    onclick: noop,
    // 星期显示文本
    weekTextList: weekTextList.slice(0),
    // 样式规则.
    classes: {
      // 当天
      today: function (data) {
        var today = this.today
        if (
          today.getFullYear() === data.year &&
          today.getMonth() === data.month &&
          today.getDate() === data.day
        ) {
          return 'today'
        }
      },
      // 非当月天
      notInMonth: function (data) {
        if (!data.current) {
          return 'not-current-month'
        }
      },
      // 周末
      weekend: function (data) {
        if (data.week == 0 || data.week == 6) {
          return 'weekend'
        }
      },
      // 范围
      disabled: function (data) {
        if (!inRange(
          toDate(data.year, data.month, data.day),
          [this.min, this.max]
        )) {
          return 'disabled'
        }
      },
      // 选中样式
      selected: function (data) {
        if (this.selected) {
          for (var i = 0, l = this.selected.length; i < l; ++i) {
            var tmp = this.selected[i]
            if (tmp === toString(data.year, data.month, data.day)) {
              return 'selected'
            }
          }
        }
      },
      // 其他月, 相同日期
      // * 防止和当天冲突
      // * 防止高亮显示其他月份日期
      sameday: function (data) {
        var day = this.today.getDate()
        var string = toString(this.today)
        var tmp = toString(data.year, data.month, data.day)
        if (
          // 非当天
          tmp != string &&
          // 天
          data.day == day &&
          // 当月
          data.month == this.date.getMonth()
        ) {
          return 'sameday'
        }
      },
      // 同月
      samemonth: function (data) {
        if (data.month === this.today.getMonth()) {
          return 'samemonth'
        }
      },
      // 同年
      sameyear: function (data) {
        if (data.year === this.today.getFullYear()) {
          return 'sameyear'
        }
      },
      // 高亮当前月
      selectedmonth: function (data) {
        if (data.month === this.date.getMonth()) {
          return 'selected'
        }
      },
      // 高亮当前年
      selectedyear: function (data) {
        if (data.year === this.date.getFullYear()) {
          return 'selected'
        }
      }
    }
  }

  // 方便重写 render 方法.
  calendar.util = {
    firstDayOfDate: firstDayOfDate,
    isLeapYear: isLeapYear,
    fixedWeek: fixedWeek,
    getDaysInMonth: getDaysInMonth,
    inRange: inRange,
    calc: calc,
    toDate: toDate,
    toString: toString
  }

  function calendar (config) {
    var isInstance = this instanceof calendar
    if (!isInstance) {
      return new calendar(config)
    }

    // 合并 config
    var _config = mixin({}, calendar.defaultConfig)
    config = mixin(_config, config, true)
    this.config = config

    this.min = config.min ? toDate(config.min) : false
    this.max = config.max ? toDate(config.max) : false

    // 调整 week 的文案顺序
    var start = this.start = config.start
    fixedWeekList(start, config.weekTextList)

    // 记录今天的日期
    this.today = toDate(config.today)

    // 记录当前日期
    // 一般和 today 同步
    // 默认: today
    this.date = toDate(config.date || this.today)

    // 更新状态
    updateState.call(this)

    // 高亮当前日期
    this.selected = [toString(this.date)]

    // 记录容器
    this.box = config.box
  }

  // 更新配置信息
  calendar.prototype.setConfig = function (config) {
    this.config = mixin(this.config, config, true)
    updateState.call(this)
    return this
  }

  function renderday () {
    var self = this
    var html = ''

    // 拼头部导航
    var year = this.date.getFullYear()
    var month = this.date.getMonth()
    html += '<caption>'
    html += '<a class="calendar-prev" data-action="prev-month"></a>'
    html += '<span class="title" data-action="show-month">' + year + '年' + (month + 1) + '月' + '</span>'
    html += '<a class="calendar-next" data-action="next-month"></a>'
    html += '</caption>'

    // 拼星期
    html += '<tr>'
    for (var i = 0; i < 7; ++i) {
      html += '<th>' + weekTextList[i] + '</th>'
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
      var list = grid.call(self, data, ['today', 'notInMonth', 'weekend', 'disabled', 'selected', 'sameday'])
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
    html += '<a class="calendar-prev" data-action="prev-year"></a>'
    html += '<span class="title" data-action="show-year">' + year + '年' + '</span>'
    html += '<a class="calendar-next" data-action="next-year"></a>'
    html += '</caption>'
    html += '<tr>'
    for (var i = 1, l = 12; i <= l; ++i) {
      var date = toString(year, i - 1, day)
      html += '<td data-date="' + date + '">'
      var list = grid.call(this, {
        year: year,
        month: i - 1,
        day: day
      }, ['samemonth', 'selectedmonth', 'disabled'])
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
    html += '<a class="calendar-prev" data-action="prev-view-year"></a>'
    html += '<span class="title">' + (year - 5) + '年 - ' + (year + 6) + '年</span>'
    html += '<a class="calendar-next" data-action="next-view-year"></a>'
    html += '</caption>'
    html += '<tr>'
    for (var i = 1, l = 12; i <= l; ++i) {
      var date = toString(year - 6 + i, month, day)
      html += '<td data-date="' + date + '">'
      var list = grid.call(this, {
        year: year - 6 + i,
        month: month,
        day: day
      }, ['sameyear', 'selectedyear', 'disabled'])
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
    var html = '<table class="calendar ' + type + '-view">'
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
    var date = this.date
    var theWeekOfFirstDay = firstDayOfDate(
      date.getDate(),
      date.getDay()
    )
    var index = 0
    var paddingDays = (7 - this.start + theWeekOfFirstDay) % 7
    // paddingDays = paddingDays == 0 ? 7 : paddingDays;

    // @todo.
    // 初始化
    // 记录当前屏, 显示的日期
    this.views = this.views || []
    this.views.length = 0

    // 需要补充格子 - 上个月日期
    if (paddingDays) {
      var _date = calc({
        year: date.getFullYear(),
        month: date.getMonth() - 1,
        day: date.getDate()
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
    // 28, 29, 30, 31 => +6 => 7 * 6
    var alldays = 5 * 7
    if (index <= alldays) {
      var _date = calc({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      })
      var i = 1
      while (index < alldays) {
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

  /*
    nextYear/nextMonth
    prevYear/prevMonth
    只更新数据, 不负责渲染
  */
  each(['next', 'prev'], function (prefix) {
    each(['year', 'month', 'day'], function (type) {
      var _type = type.charAt(0).toUpperCase() + type.slice(1)
      var method = prefix + _type
      calendar.prototype[method] = calendar.util[method] = function (date) {
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
        if (this instanceof calendar) {
          this.date = value
          return this
        }
        return value
      }
    })
  })

  calendar.prototype.changeyearview = function (view) {
    this.viewyear = this.viewyear || this.date.getFullYear()
    this.viewyear += view * 12
    this.render('year')
  }

  calendar.prototype.goto = function (date) {
    date = toDate(date)
    this.date = date
    this.selected = [toString(date)]
    updateState.call(this)
    return this
  }

  calendar.prototype.get = function () {
    return this.selected
  }

  calendar.prototype.show = function () {
    this.date = toDate(this.selected[0] || this.config.date || this.today)
    this.box.style.display = 'block'
    return this.render()
  }

  calendar.prototype.hide = function () {
    this.box.style.display = 'none'
    return this
  }
})(this)
