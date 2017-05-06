;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    root.imageLoader = factory()
  }
})(this, function () {
  'use strict'

  var list = []
  var loading = {}
  var cache = false

  function callback (ret, src) {
    var cbs = loading[src]
    if (cbs) {
      for (var i = 0; i < cbs.length; ++i) {
        var cb = cbs[i]
        if (typeof cb === 'function') {
          cb(ret)
        }
      }
      delete loading[src]
      if (cache && !ret) {
        list.push([src, cbs])
      }
    }
  }

  // 使用回调函数
  // 以便支持 image 标签的 src 属性以及 background-image 样式
  function load (src, cb, force) {
    if (loading[src]) {
      if (force) Array.prototype.push.apply(loading[src], cb)
      return
    }

    var img = document.createElement('img')
    img.src = src
    loading[src] = [cb]

    if (img.complete) {
      callback(true, src)
      return
    }

    img.onload = function () {
      img.onerror = img.onload = null
      callback(true, src)
    }
    img.onerror = function () {
      img.onerror = img.onload = null
      callback(false, src)
    }
  }

    // 手动调用.
    // ex: offline -> online 时调用.
  function reload () {
    var item
    var stack = list.slice(0)
    list.length = 0
    while ((item = stack.pop())) {
      load(item[0], item[1])
    }
  }

  return {
    load: load,
    reload: reload,
      // Global setting
    cache: function (use) {
      cache = !!use
    }
  }
})
