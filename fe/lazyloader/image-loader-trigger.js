/*
  * debounce
  * 清理 timer, 延迟检查
  * 检查 - viewport 内图片情况
  * 开始加载
  * 加载后处理
*/

var loader = imageLoader.load
var classname = 'lazyload'

function inviewport (node, offset) {
  var rect = node.getBoundingClientRect()
  var top = rect.top
  var bottom = rect.bottom
  var viewport = window.innerHeight || document.documentElement.clientHeight
  return (
    (top < 0 && bottom > 0) ||
    (top > 0 && bottom < viewport) ||
    (top > 0 && top < viewport)
  )
}

function callback (box, src, ret) {
  if (ret) {
    box.style.cssText = 'background-image: url(' + src + '); background-size: cover;'
    box.removeAttribute('data-src')
    var reg = new RegExp('\\b' + classname + '\\b')
    box.className = box.className.replace(reg, '')
  }
}

function check () {
  var images = document.querySelectorAll('.' + classname)
  for (var i = 0; i < images.length; ++i) {
    var image = images[i]
    if (inviewport(image, 0)) {
      ;(function (image) {
        var src = image.getAttribute('data-src')
        if (src) {
          loader(src, function (ret) {
            callback(image, src, ret)
          })
        }
      })(image)
    }
  }
}

var handler = (function () {
  var timer
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(check, 50)
  }
})()

window.addEventListener('scroll', handler)
handler()
