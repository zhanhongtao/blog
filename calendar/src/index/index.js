import { Init as Calendar, util } from './main.js'

let contexts = document.querySelectorAll('.calendar')
for (let context of contexts) {
  let dataset = context.querySelector('input').dataset
  let config = {}
  for (let name in dataset) {
    let value
    switch (dataset[name]) {
      case 'today':
        value = util.toDate()
        break
      case '+20':
        value = util.toDate(new Date().getTime() + 20 * 24 * 60 * 60 * 1000)
        break
      case '+10':
        value = util.toDate(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
        break
      default:
        value = dataset[name]
    }
    if (name === 'range') {
      config.classes = config.classes || {}
      config.classes.range = function (data, type) {
        let ca = false
        switch (type) {
          case 'day':
            ca = data.year === 2017 && data.month === 3 && [1, 4, 6, 8, 10].indexOf(data.day) > -1
            break
          case 'month':
            ca = data.year === 2017 && data.month === 3
            break
          case 'year':
            ca = data.year === 2017
        }
        return ca ? 'inrange' : 'notinrange ' + this.style.disabled
      }
    } else {
      config[name] = value
    }
  }
  context.calendar = Calendar(context, config)
}

var x = document.querySelector('#x')
var y = document.querySelector('#y')

var xc = x.calendar
var yc = y.calendar

fixed(
  x.querySelector('input').value
)

xc.handler = function (date) {
  var value = util.paddingDate(date)
  x.querySelector('input').value = value
  fixed(date)
}

function fixed (value) {
  if (typeof value === 'string') value = util.toDate(value)
  var vy = y.querySelector('input').value

  var min = value
  var max = util.toDate(min.getTime() + 30 * 24 * 60 * 60 * 1000)
  yc.setConfig({
    min: min,
    max: max
  })
  if (!util.inRange(util.toDate(vy), [min, max])) {
    yc.set(value)
  }
}

let nextNodes = document.querySelectorAll('.next')
for (let nextNode of nextNodes) {
  nextNode.addEventListener('click', function (e) {
    let node = document.querySelector('#' + this.dataset.id)
    let context = node.calendar
    context.nextDay()
    context.set(context.date)
  })
}

let previousNodes = document.querySelectorAll('.previous')
for (let previousNode of previousNodes) {
  previousNode.addEventListener('click', function (e) {
    let node = document.querySelector('#' + this.dataset.id)
    let context = node.calendar
    context.prevDay()
    context.set(context.date)
  })
}

let todayNodes = document.querySelectorAll('.today')
for (let todayNode of todayNodes) {
  todayNode.addEventListener('click', function (e) {
    let node = document.querySelector('#' + this.dataset.id)
    let context = node.calendar
    context.set(context.today)
  })
}

