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

/*
  0. 是否支持加载? 否, 结束
  1. 是否正在加载中? 是, 结束;
  2. 判定 helper 节点是否在 viewport 内? 否, 结束
  3. 更新标记, 开始加载
  4. 加载结束, 更新标记
*/
var createLoader = function (box, handler) {
  var support = true
  var status = 0
  var helper = document.createElement('div')
  helper.style.cssText = 'height: 0 !important; overflow: hidden !important;'
  box.appendChild(helper)
  return function loader (force) {
    if ((support || force) && status === 0) {
      if (inviewport(helper, 10)) {
        status = 1
        handler().done(function (ending) {
          support = true
          status = ending ? 2 : 0
          if (!ending) {
            setTimeout(loader, 100)
          }
        }).fail(function () {
          status = 0
          support = false
        })
      }
    }
  }
}

/*
  交互状态
  * (0)默认状态 - 点击可加载
  * (1)正在加载中... - 无操作
  * (2)加载成功, 200ms 内恢复到[默认状态或者结束状态]
  * (3)加载失败 - 点击可重试加载
  * (4)加载结束 - 无操作
*/
var createLoaderProxy = function (box, f) {
  var status = 0
  var statusMap = {
    0: ['initial', '点击加载更多'],
    1: ['pending', '正在加载中...'],
    2: ['success', '加载成功'],
    3: ['fail', '加载失败, 点击重新加载'],
    4: ['complete', '没有更多数据']
  }
  var node = document.createElement('div')
  var classname = 'loadingbar'
  node.className = classname
  node.addEventListener('click', function (e) {
    if (status === 0 || status === 3) loader(true)
  })
  box.appendChild(node)
  function update (s) {
    status = s
    node.className = classname + ' ' + classname + '--' + statusMap[status][0]
    node.innerHTML = '<span>' + statusMap[status][1] + '</span>'
  }
  var loader = createLoader(box, function () {
    update(1)
    var dfd = new $.Deferred()
    f().done(function (ending) {
      update(ending ? 4 : 2)
      if (!ending) {
        setTimeout(function () {
          update(0)
        }, 500)
      }
      dfd.resolve(ending)
    }).fail(function () {
      update(3)
      dfd.reject()
    })
    return dfd.promise()
  })
  return loader
}
