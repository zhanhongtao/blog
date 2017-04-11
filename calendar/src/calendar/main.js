import { Calendar } from './calendar.js'
import style from './index.scss'

var weekTextList = [
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六'
]

// 默认配置
var defaultConfig = {
  style: style,
  // 星期规则
  // 认为从星期几开始显示
  // 其中, 0 表示周日
  start: 0,
  today: Calendar.util.toDate(),
  min: Calendar.util.toDate('1900-1-1'),
  onclick: function () {},
  // 星期显示文本
  weekTextList: weekTextList.slice(0),
  // 样式规则.
  classes: {
    // 当天
    today: function (data, type) {
      var today = this.today
      if (
        type === 'day' &&
        today.getFullYear() === data.year &&
        today.getMonth() === data.month &&
        today.getDate() === data.day
      ) {
        return style.today
      }
    },
    // 非当月天
    notInMonth: function (data, type) {
      if (type === 'day' && !data.current) {
        return style['not-current-month']
      }
    },
    // 周末
    weekend: function (data, type) {
      if (type === 'day') {
        if (data.week === 0 || data.week === 6) {
          return style.weekend
        }
      }
    },
    // 范围
    disabled: function (data) {
      if (!Calendar.util.inRange(
        Calendar.util.toDate(data.year, data.month, data.day),
        [this.config.min, this.config.max]
      )) {
        return style.disabled
      }
    },
    // 选中样式
    selected: function (data, type) {
      if (type === 'day' && this.selected) {
        for (var i = 0, l = this.selected.length; i < l; ++i) {
          var tmp = this.selected[i]
          if (tmp === Calendar.util.toString(data.year, data.month, data.day)) {
            return style.selected
          }
        }
      }
    },
    // 其他月, 相同日期
    // * 防止和当天冲突
    // * 防止高亮显示其他月份日期
    sameday: function (data, type) {
      if (type === 'day') {
        var day = this.today.getDate()
        var string = Calendar.util.toString(this.today)
        var tmp = Calendar.util.toString(data.year, data.month, data.day)
        if (
          // 非当天
          tmp !== string &&
          // 天
          data.day === day &&
          // 当月
          data.month === this.date.getMonth()
        ) {
          return style.sameday
        }
      }
    },
    // 同月
    samemonth: function (data, type) {
      if (type === 'month' && data.month === this.today.getMonth()) {
        return style.samemonth
      }
    },
    // 同年
    sameyear: function (data, type) {
      if (type === 'year' && data.year === this.today.getFullYear()) {
        return style.sameyear
      }
    },
    // 高亮当前月
    selectedmonth: function (data, type) {
      if (type === 'month' && data.month === this.date.getMonth()) {
        return style.selected
      }
    },
    // 高亮当前年
    selectedyear: function (data, type) {
      if (type === 'year' && data.year === this.date.getFullYear()) {
        return style.selected
      }
    }
  }
}

function walkdom (target, handle, context) {
  while (target && target.nodeType === 1) {
    if (handle(target)) return target
    if (target === context) break
    target = target.parentNode
  }
  return false
}

function calendarToggleView (calendar, flag) {
  calendar.view = flag == null ? (calendar.view == null ? false : calendar.view) : !flag
  calendar.view = !calendar.view
  calendar[calendar.view ? 'show' : 'hide']()
}

function gridhandler (target, context, calendar) {
  var dom = target.querySelector('.' + style.grid)
  var disabled = dom.classList.contains(style.disabled)
  if (disabled) return
  var selected = style.selected
  var selectedNode = context.querySelector('.' + selected)
  if (selectedNode) selectedNode.classList.remove(selected)
  dom.classList.add(selected)
  var value = target.dataset.date
  calendar.goto(value)
  return value
}

function action (calendar, action) {
  switch (action) {
    case 'next-view-year':
      calendar.changeyearview(1)
      break
    case 'prev-view-year':
      calendar.changeyearview(-1)
      break
    case 'show-month':
      calendar.render('month')
      break
    case 'show-year':
      calendar.render('year')
      break
    case 'next-year':
      calendar.nextYear()
      calendar.render('month')
      break
    case 'prev-year':
      calendar.prevYear()
      calendar.render('month')
      break
    case 'next-month':
      calendar.nextMonth()
      calendar.render()
      break
    case 'prev-month':
      calendar.prevMonth()
      calendar.render()
      break
    case 'prev-day':
      var prevday = Calendar.util.prevDay(calendar.get()[0])
      calendar.goto(prevday)
      calendar.render(Calendar.util.toString(prevday))
      calendarToggleView(calendar, false)
      break
    case 'next-day':
      var nextday = Calendar.util.nextDay(calendar.get()[0])
      calendar.goto(nextday)
      calendar.render(Calendar.util.toString(nextday))
      calendarToggleView(calendar, false)
      break
    case 'show-calendar':
      calendarToggleView(calendar)
      break
    default:
      break
  }
}

// 容器节点
// 绑定回调
// 初始化 - 尽可能晚
// 点击其他位置时, 要隐藏浮层
// 支持配置
function Init (context, config) {
  config = Calendar.util.extend(true, {}, defaultConfig, config || {})

  // 准备容器
  var layer = document.createElement('div')
  layer.classList.add(style.calendar)
  context.appendChild(layer)

  // 实例
  var ctx = new Calendar(
    Calendar.util.extend(true, { box: layer }, config)
  )

  ctx.handler = config.handler || function (value) {
    var c = context.querySelector('.calendar')
    c.value = value
    try {
      c.innerText = value
    } catch (e) {}
  }

  // 初始化
  ctx.handler(
    (
      config.date ||
      Calendar.util.toString(config.today || Calendar.util.toDate())
    )
  )

  context.addEventListener('click', function (e) {
    var node = walkdom(e.target, function (node) {
      if (node.classList.contains('calendar')) return node
    }, context)
    if (node) {
      calendarToggleView(ctx)
    }
  })

  // 绑定 grid 相关事件
  context.addEventListener('click', function (e) {
    var node = walkdom(e.target, function (node) {
      return node.nodeName === 'TD' ? node : false
    })
    if (node) {
      var value = gridhandler(node, context, ctx)
      if (value) {
        ctx.handler(value)
        switch (ctx.viewtype) {
          case 'year':
            ctx.render('month')
            e.stopPropagation()
            break
          case 'month':
            ctx.render('day')
            e.stopPropagation()
            break
          case 'day':
            calendarToggleView(ctx, false)
            break
        }
      } else {
        return false
      }
    }
  })

  // 策略:
  // 暴力隐藏 - 但需要延迟, 加到 context 上
  // 判定 context, 清理即可
  document.addEventListener('click', function (e) {
    context.viewtimer = setTimeout(function () {
      if (ctx) {
        calendarToggleView(ctx, false)
      }
    })
    walkdom(e.target, function (target) {
      setTimeout((function (target) {
        return function () {
          var dataset = target.dataset
          if (dataset && dataset.action) {
            if (ctx) {
              action(ctx, dataset.action)
            }
          }
        }
      })(target), 0)
      if (target === context) {
        clearTimeout(context.viewtimer)
      }
    })
  })

  return ctx
}

export {
  Init as init,
  Calendar as Instance
}
