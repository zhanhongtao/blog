function htmlEncode( code ) {
  var entityMap = {
    // @NOTE: 防止 html 实体, 以及其它进制表示.
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    // @NOTE: &apos; 不是标准 HTML 标签.
    // 使用 16 进制表示.
    "'": '&#x27;',
    // @NOTE: / 字符是 html 标签结束字符.
    // 需要编码, 防止把数据写在 html 标签属性部分.
    "/": '&#x2F;',
    "\\": '&#x5c;'
  };
  return String(code).replace(/[&<>"'\/\\]/g, function( key ) {
    return entityMap[ key ];
  });
}

function htmlDecode( code ) {
  var map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': '\'',
    '&#x2F;': '/',
    '&#x5c;': '\\'
  };
  return String(code).replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;|&#x5c;/gi, function( key ) {
    return map[ key ];
  });
};

