(function(root) {

var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

// 前补充 0
function padding (string, length, d) {
  var l = string.length === 0 ? length :
    string.length % length ? length - string.length % length : 0
  while (l--) string = d + string
  return string
}

/*
  # unicode 字符集编码转成 utf8 编码
  单字节   0000-0000--0000-007F | 0xxx-xxx -> 求 &
  二个字节 0000-0080--0000-07FF | 110x-xxxx-10xx-xxxx
  三个字节 0000-0800--0000-FFFF | 1110-xxxx-10xx-xxxx-10xx-xxxx
  四个字节 0001-0000--0010-FFFF | 1111-0xxx-10xx-xxxx-10xx-xxxx-10xx-xxxx
  1. 得到字符的 unicode 编码
  2. 计算编码属于哪个范围内, 得到模板格式
  3. 得到编码的二进制串, 从右向左替换 x, 剩余 x 替换成 0
  # utf8 编码转成 unicode 字符集编码
  1. 转成二进制位
  2. 确认属于哪个范围, 得到字符有几个字节组成, 得到完整二进制位
  3. 得到字符编码(10), 转成字符 - String.fromCodePoint(code)
*/
function unicode2utf8 (unicode) {
  var range = [0x7f, 0x7ff, 0xffff, 0x010ffff]
  var tpls = [0, 49280, 14712960, 4034953344]
  /*
    [
      0b0,
      0b1100000010000000,
      0b111000001000000010000000,
      0b11110000100000001000000010000000
    ]
  */
  var b = 1
  for (var i = 0; i < range.length; ++i) {
    if (unicode < range[i]) break
    ++b
  }
  // 3
  var code = tpls[b - 1]
  if (b === 1) {
    code = code | unicode
  } else {
    var l = b
    while (b && unicode) {
      // 从右取 6 位
      var cur = ((1 << 6) - 1) & unicode
      cur = cur << ((l - b) * 8)
      unicode = unicode >> 6
      code = code | cur
      --b
    }
  }
  return code
}

function utf82unicode (code) {
  code = +code
  // 单字节表示时, 直接返回即可
  if (code < 0x80) return code
  // 转成二进制表示
  var bc = padding(code.toString(2), 8, '0')
  // 确认使用第几个模板
  // 索引从 0 开始
  var b = 1
  for (var i = 0; bc[i] === '1'; ++i) ++b
  // 使用模板向回转...
  // 一定以 1 开头
  var t = b
  var base2 = ''
  while (b) {
    base2 += bc.slice(b === t ? b : 2, 8)
    bc = bc.slice(8)
    --b
  }
  return parseInt(base2, 2)
}

function getBytes(n) {
  var c = 1
  while(n = (n >> 8)) ++c 
  return c
}

function base64 (string) {
  var ret = []
  for (var chr of string) {
    var unicode = chr.codePointAt(0)
    var code = unicode2utf8(unicode)
    var bytes = getBytes(code)
    for (var i = 0; i < bytes; ++i) {
      var c = code >> (8 * (bytes - 1 - i))
      ret.push(((1 << 8) - 1) & c)
    }
  }
  var result = []
  var j = 0
  for (var i = 0, l = ret.length; i < l; i += 3) {
    // 第一个 6 位
    var b = (ret[i] & 0xfc) >> 2
    result[j++] = table[b]
    // 第二个六位 - 有可能不存在
    b = (ret[i] & 0x3) << 4
    if (i + 1 < l) {
      //  第二个 8 位
      b |= (ret[i + 1] & 0xf0) >> 4
      result[j++] = table[b]
      b = (ret[i + 1] & 0xf) << 2
      if (i + 2 < l) {
        // 第三个 8 位
        b |= (ret[i + 2] & 0xc0) >> 6
        result[j++] = table[b]
        b = ret[i + 2] & 0x3f
        result[j++] = table[b]
      } else {
        result[j++] = table[b]
        result[j++] = '='
      }
    } else {
      // 比如: 单字节字符
      result[j++] = table[b]
      result[j++] = '=='
    }
  }
  return result.join('')
}

function base64decode(string) {
  var codebase2 = ''
  var code
  for (var i = 0, l = string.length; i < l; ++i) {
    code = string[i] === '=' ? 0 : table.search(string[i])
    codebase2 += padding(String(code.toString(2)), 6, '0')
  }
  var tmp = ''
  while (codebase2) {
    var b = 0
    for (var i = 0; codebase2[i] === '1'; ++i) ++b
    code = parseInt(codebase2.slice(0, 8 * b || 8), 2)
    // code 是 utf8 编码.
    // 需要转为 unicode 字符集的 codepoint
    code = utf82unicode(code)
    tmp += String.fromCodePoint(code)
    codebase2 = codebase2.slice(8 * b || 8)
  }
  return tmp
}

root.base64Encode = base64;
root.base64Decode = base64decode;
root.utf82unicode = utf82unicode;
root.unicode2utf8 = unicode2utf8;

})(this)
