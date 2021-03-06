import { calendar as cal, utils } from './calendar.js'
import style from './index.scss'

var weekTextList = ['日', '一', '二', '三', '四', '五', '六']

// 默认配置
var defaultConfig = {
  style: style,
  // 索引, 表示一周的第一天是周几
  start: 0,
  min: utils.toDate('1900-01-01'),
  // 星期显示文本
  weekTextList: weekTextList.slice(0),
  // 样式规则
  // @todo: 没必要时用多个函数...
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
      if (!utils.inRange(
        utils.toDate(data.year, data.month + 1, data.day),
        [this.config.min, this.config.max]
      )) {
        return style.disabled
      }
    },
    // 选中样式
    selected: function (data, type) {
      if (type === 'day') {
        var tmp = utils.paddingDate(this.selected)
        if (tmp === utils.paddingDate(data.year, data.month + 1, data.day)) {
          return style.selected
        }
      }
    },
    // 其他月, 相同日期
    // * 防止和当天冲突
    // * 防止高亮显示其他月份日期
    sameday: function (data, type) {
      if (type === 'day') {
        var day = this.today.getDate()
        var string = utils.paddingDate(this.today)
        var tmp = utils.paddingDate(data.year, data.month + 1, data.day)
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
  if (target.classList.contains(style.disabled)) return
  var selected = style.selected
  var selectedNode = context.querySelector('.' + selected)
  if (selectedNode) selectedNode.classList.remove(selected)
  target.classList.add(selected)
  var td = target.parentNode
  var value = td.getAttribute('data-date')
  calendar.set(value)
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
    case 'show-calendar':
      calendarToggleView(calendar)
      break
    default:
      break
  }
}

// 策略:
// 暴力隐藏 - 但需要延迟, 加到 context 上
// 判定 context, 清理即可
var handler = (function () {
  var contexts = []
  var ctxs = []
  document.addEventListener('click', function (e) {
    for (var i = 0; i < ctxs.length; ++i) {
      ;(function (i) {
        contexts[i].viewtimer = setTimeout(function () {
          calendarToggleView(ctxs[i], false)
        }, 10)
      })(i)
    }
    // 只执行单个 action
    var method
    var ctx
    walkdom(e.target, function (target) {
      if (method === null || method === undefined) {
        method = target.getAttribute('data-action')
      }
      if (ctx === null || ctx === undefined) {
        for (var i = 0; i < ctxs.length; ++i) {
          if (target === contexts[i]) {
            ctx = ctxs[i]
          }
        }
      }
      for (var j = 0; j < ctxs.length; ++j) {
        if (target === contexts[j]) {
          clearTimeout(contexts[j].viewtimer)
        }
      }
    })
    if (ctx && method) {
      action(ctx, method)
    }
  })
  return function (context, ctx) {
    contexts.push(context)
    ctxs.push(ctx)
  }
})()

// 容器节点
// 绑定回调
// 初始化 - 尽可能晚
// 点击其他位置时, 要隐藏浮层
// 支持配置
function Calendar (context, config) {
  config = utils.extend(true, {}, defaultConfig, config || {})

  var wrap = document.createElement('div')
  wrap.className = style.wrap
  context.parentNode.insertBefore(wrap, context)
  wrap.appendChild(context)

  // 准备容器
  var layer = document.createElement('div')
  layer.classList.add(style.helper)
  wrap.appendChild(layer)

  config.handler = config.handler || function (date) {
    var c = context.querySelector('input')
    var value = utils.paddingDate(date)
    c.value = value
    try {
      c.innerText = value
    } catch (e) {}
  }

  // @todo. 延迟实例化
  var ctx = new cal(
    utils.extend(true, { box: layer }, config)
  )

  // 初始化
  ctx.handler(config.date || config.today || utils.toDate())

  wrap.addEventListener('click', function (e) {
    var node = walkdom(e.target, function (node) {
      if (node.classList.contains('calendar')) return node
    }, context)
    if (node) {
      calendarToggleView(ctx)
    }
  })

  // 绑定 grid 相关事件
  layer.addEventListener('click', function (e) {
    var node = walkdom(e.target, function (node) {
      return node.classList.contains(style.grid) ? node : false
    })
    if (node) {
      var value = gridhandler(node, layer, ctx)
      if (value) {
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

  handler(wrap, ctx)

  return ctx
}

export { utils, Calendar }
