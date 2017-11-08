function type(s) {
  return Object.prototype.toString.call(s).slice(8, -1).toLowerCase()
}

function isKeyAsObjectExist (keys, index, helper) {
  var prefix = keys.slice(0, index + 1).join('.')
  return Object.keys(helper).some(key => key.indexOf(prefix + '.') === 0) || (helper[keys[index]] && index + 1 < keys.length)
}

function defaultHandler (key, value, o, multiple) {
  if (multiple && value.search(/\s/) > -1) {
    value = value.split(/\s+/)
  }
  if (o[key]) {
    value = Array.isArray(value) ? value : [value]
    value = Array.isArray(o[key]) ? [...o[key], ...value] : [o[key], ...value]
  }
  return [key, value]
}

function write (keystr, json, helper) {
  var keys = keystr.split('.')
  var length = keys.length
  keys.reduce((json, key, index) => {
    if (!json[key]) {
      return json[key] = {}
    } else {
      if (
        json[key] &&
        type(json[key]) === 'object' &&
        isKeyAsObjectExist(keys, index, helper)
      ) {
        return json[key]
      } else {
        var ret = {}
        json[key] = Array.isArray(json[key]) ? [...json[key], ret] : [json[key], ret]
        return ret
      }
    }
  }, json)
  helper[keystr] = 1
}

function read (key, json) {
  if (key) {
    var keys = key.split('.')
    return keys.reduce((json, key) => {
      var value = json[key] = json[key] || {}
      return Array.isArray(value) ? value[value.length - 1] : value
    }, json)
  } else {
    return json
  }
}

function parser (string, handler = defaultHandler, usecomment = true, multiple = true) {
  let json = {}
  let lines = String(string).split(/\r?\n/)
  let key = ''
  let helper = new Map
  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i].trim()
    // 过滤空行
    if (line === '') continue
    // 注释行
    let out = true
    if (line[0] === '#') {
      if (usecomment) {
        out = false
        line = line.slice(1).trim()
      } else continue
    }
    // 去掉行注释
    let index = line.indexOf('#')
    if (index > -1) {
      line = line.slice(0, index).trim()
    }
    // 过滤空行
    if (line === '') continue
    // 查看是不是分类标记
    if (line[0] === '[' && line[line.length - 1] === ']' && (!(usecomment && out))) {
      key = line.slice(1, -1)
      write(key, json, helper)
    } else if (out) {
      let o = read(key, json)
      // 分割 Key/value 对
      // 使用空白分割
      let sp = line.search(/\s/)
      if (sp > -1) {
        let [k, v] = handler(
          line.slice(0, sp),
          line.slice(sp).trim(),
          o,
          multiple
        )
        if (k) {
          o[k] = v
        }
      } else {
        // 针对只有 key 的情况.
        o[line] = ''
      }
    }
  }
  return json
}

module.exports = parser
