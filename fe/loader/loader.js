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
  return function loader (force, unuse, args) {
    if (force) {
      support = true
      status = 0
    }
    if (support && status === 0) {
      if (unuse || inviewport(helper, 10)) {
        status = 1
        return handler.apply(null, args || []).done(function (res) {
          status = res.complete ? 1 : 0
          if (status === 0) {
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
var createLoaderProxy = function (box, handler, config) {
  config = config || {}
  var classname = config.classname || 'loadingbar'
  var update = config.update || function (node, status) {
    var statusMap = {
      0: ['initial', '点击加载更多'],
      1: ['pending', '正在加载中...'],
      2: ['success', '加载成功'],
      3: ['fail', '加载失败, 点击重新加载'],
      4: ['complete', '没有更多数据']
    }
    node.className = classname + ' ' + classname + '--' + statusMap[status][0]
    node.innerHTML = '<span>' + statusMap[status][1] + '</span>'
  }
  var node = document.createElement('div')
  node.className = classname
  node.addEventListener('click', function (e) {
    if (status === 0 || status === 3) loader(true, false)
  })
  box.appendChild(node)
  var status = 0
  var loader = createLoader(box, function () {
    update(node, status = 1)
    var dfd = new $.Deferred()
    handler.apply(null, arguments).done(function (res) {
      update(node, status = res.complete ? 4 : 2, res)
      if (status === 2) {
        setTimeout(function () {
          update(node, status = 0)
          dfd.resolve(res)
        }, 600)
      } else {
        dfd.resolve(res)
      }
    }).fail(function (res) {
      update(node, status = 3, res)
      dfd.reject(res)
    })
    return dfd.promise()
  })
  return loader
}
