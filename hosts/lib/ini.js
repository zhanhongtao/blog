function create(object, keystr) {
  let keys = keystr.split('.').filter(key => key.trim() !== '')
  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i].trim()
    let tmp = {}
    if (object[key] == null) {
      object[key] = tmp
      object = object[key]
    } else {
      let current = object[key]
      if (i + 1 === keys.length) {
        if (Object.prototype.toString.call(current) !== '[object Array]') {
          object[key] = [current]
        }
        object[key].push(tmp)
        object = tmp
      } else {
        object = current
      }
    }
  }
  return object
}

// 跳过空行
var skipEmptyLinePlugin = function ({index, text}) {
  return text.trim() === ''
}

// 跳过注释行
var commentPlugin = function (char) {
  return function ({index, text}) {
    return text.trimLeft().slice(0, char.length) === char
  }
}

// 支持块格式数据
var blockPlugin = function () {
  var prev = null
  return function (helper) {
    var { index, text, data } = helper
    // 结束块可选，也便于回到 global
    if (/^\s*#\s*\[\/end\]/i.test(text) || helper.reset) {
      helper.data = prev || hepler.data
      return true
    }
    // TODO. 自定义 # 符号
    var group = text.match(/^\s*#\s*\[(.+)\]/)
    if (group) {
      var key = group[1].trim()
      if (key) {
        // 约定: key 需要从第一层开始写
        prev = prev || helper.data
        helper.data = create(prev, key)
        return true
      }
    }
  }
}

var bindPlugin = function (build) {
  return function(helper) {
    let { text, data } = helper
    text = text.trim()
    let index = text.search(/\s+/)
    let key = text.slice(0, index)
    let value = text.slice(index).trim()
    if (typeof build === 'function') {
      build(key, value, data)
    } else {
      // 处理行尾注释
      data[key] = value.replace(/#.*/, '')
    }
  }
}

function parser (string) {
  var plugins = [
    skipEmptyLinePlugin,
    blockPlugin(),
    commentPlugin('#'),
    bindPlugin()
  ]
  let json = {}
  let lines = String(string).split(/\r?\n/)
  if (lines.length) {
    let helper = {
      index: 0,
      data: json
    }
    while (helper.index <= lines.length) {
      helper.text = lines[helper.index] || ''
      if (helper.index === lines.length) helper.reset = true
      for (let i = 0; i < plugins.length; ++i) {
        let stop = plugins[i](helper)
        if (stop) break
      }
      helper.index++
    }
  }
  return json
}

module.exports = parser
