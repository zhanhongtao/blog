
var colorRandom = (function () {
  var colors = [
    '#ff66cc', '#ffcccc', '#ffccff', '#996699', '#663333', '#cc9999', '#cccccc'
  ]
  var l = colors.length - 1
  return function () {
    var index = Math.floor(Math.random() * l)
    var color = colors[index]
    colors[index] = colors[l]
    colors[l] = color
    return color
  }
})()

function render () {
  var list = document.getElementById('list')
  var fragment = document.createDocumentFragment()
  for (var i = 0; i < 3; ++i) {
    var div = document.createElement('div')
    div.className = 'item'
    div.style.cssText = 'background-color: ' + colorRandom()
    fragment.appendChild(div)
  }
  list.appendChild(fragment)
}

var handler = (function () {
  var times = 10
  return function () {
    var dfd = new $.Deferred()
    if (times > 0) {
      setTimeout(function () {
        if (Math.random() > 0.2) {
          render()
          dfd.resolve({ complete: --times === 0 })
        } else {
          dfd.reject()
        }
      }, 500)
    } else {
      dfd.resolve({ complete: true })
    }
    return dfd.promise()
  }
})()

var loader = createLoaderProxy(document.getElementById('box'), handler)

var p = loader()
if (p) {
  p.done(function (res) {
    console.log(res)
  })
}

var _ = {
  decounce: function (f) {
    return f
  }
}

window.addEventListener('scroll', _.decounce(loader, 100))
