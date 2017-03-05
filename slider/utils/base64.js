function base64Encode( code ) {
  try {
    return btoa( code );
  }
  catch(e) {
    alert( '异常或浏览器不支持 btoa 函数' );
  }
};

function base64Decode( code ) {
  try {
    return atob( code );
  }
  catch(e) {
    alert( '异常或浏览器不支持 atob 函数' );
  }
}


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
  单字节   0000-0000-0000-007F | 0xxx-xxx -> 求 &
  二个字节 0000-0080-0000-07FF | 110x-xxxx-10xx-xxxx
  三个字节 0000-0800-0000-FFFF | 1110-xxxx-10xx-xxxx-10xx-xxxx
  四个字节 0001-0000-0010-FFFF | 1111-0xxx-10xx-xxxx-10xx-xxxx-10xx-xxxx
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

function base64 (string) {
  var rest = ''
  var ret = []
  for (var chr of string) {
    var unicode = chr.codePointAt(0)
    var code = unicode2utf8(unicode)
    // 转为二进制串, 不够字节数时, 前补 0
    var c = code.toString(2)
    var n
    c = rest + padding(c, 8, '0')
    while (c.length >= 6) {
      // 取前 6 位(2), 转成 10 进制后, 查表得到字符
      n = parseInt(c.slice(0, 6), 2)
      // 更新结果
      ret[ret.length] = table[n]
      c = c.slice(6)
    }
    // 消耗二进制位
    rest = c
  }
  var flag = true
  // 总字节数不是 3 的倍数时
  while (rest !== '') {
    // 每次补充 8 位
    if (rest.length < 6) {
      rest += padding('', 8, '0')
    }
    n = parseInt(rest.slice(0, 6), 2)
    // 多余位使用 = 字符
    if (flag) {
      s = table[n]
      flag = !flag
    } else {
      s = '='
    }
    ret[ret.length] = s
    rest = rest.slice(6)
  }
  return ret.join('')
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
