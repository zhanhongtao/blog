import * as calendar from './main.js'

var util = calendar.Instance.util

let contexts = document.querySelectorAll('.calendar-wrap')
for (let context of contexts) {
  let dataset = context.querySelector('.calendar').dataset
  let config = {}
  for (let name in dataset) {
    let value
    switch (dataset[name]) {
      case 'today':
        value = new Date()
        break
      case '+20':
        value = new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000)
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
  let instance = calendar.init(context, config)
  context.calendar = instance
}

var x = document.querySelector('#x')
var y = document.querySelector('#y')

var xc = x.calendar
var yc = y.calendar

fixed(
  x.querySelector('.calendar').value
)

xc.handler = function (value) {
  x.querySelector('.calendar').value = value
  fixed(value)
}

function fixed (value) {
  var vy = y.querySelector('.calendar').value

  var min = new Date(value)
  var max = new Date(min.getTime() + 30 * 24 * 60 * 60 * 1000)
  yc.setConfig({
    min: min,
    max: max
  })
  if (!util.inRange(vy, [min, max])) {
    yc.goto(value)
    yc.handler(value)
  }
}

