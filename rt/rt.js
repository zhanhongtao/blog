;(function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    var template = {};
    factory(template);
    if (typeof define === "function" && define.amd) {
      define(template); // AMD
    } else {
      root.rt = template;
    }
  }
}(this, function ( rt ) {
  'use strict';
  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      var string = match[0];
      this.tail = this.tail.substring(string.length);
      this.pos += string.length;
      return string;
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
      match = this.tail;
      this.tail = "";
      break;
      case 0:
      match = "";
      break;
      default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  // 防止在拼接 JavaScript Code 时出现异常.
  var escaper = /\\|'|"|\r|\n|\u2028|\u2029/g;
  var escapes = {
    "'": "'",
    '"': '"',
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  // 初始化始末 TAG 正则.
  function escapeTags(tags) {
    if (!isArray(tags) || tags.length !== 2) {
      throw new Error('Invalid tags: ' + tags);
    }

    return [
      new RegExp(escapeRegExp(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRegExp(tags[1]))
    ];
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var changeTagRe = /\s*@/;

  var tagRe = /#|=|:=|&|@|>/;
  function parseTemplate(template, tags) {
    tags = tags || rt.tags;
    template = template || '';

    // tags 为 array, 长度为 2
    // 使用空白分隔的字符.
    if (typeof tags === 'string') {
      tags = tags.split(spaceRe);
    }
    // 确认 tag 正则.
    var tagRes = escapeTags(tags);

    // 初始化扫描器
    var scanner = new Scanner(template);
    var tokens = [];       // Buffer to hold the tokens
    var start, type, value, token;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if ( value ) {
        tokens.push( [ 'text', value, start, start + value.length ] );
        start += value.length;
      }

      // 不匹配 opening tag, 表示已结束.
      if (!scanner.scan(tagRes[0])) break;

      // 扫描特殊字符.
      // name -> JavaScript 语句
      // text -> 普通字符
      // @ -> 切换 tag
      // & -> 转义
      // = -> 输出
      // # -> 注释
      type = scanner.scan(tagRe) || 'name';

      // 跳过空白字符.
      scanner.scan(whiteRe);

      if ( type === '@' ) {
        value = scanner.scanUntil( changeTagRe );
        scanner.scan( changeTagRe );
        scanner.scanUntil( tagRes[1] );
      }
      else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // 跳过结束 tag!
      if (!scanner.scan(tagRes[1])) {
        throw new Error('Unclosed tag at ' + scanner.pos);
      }

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);
      if ( type === '@' ) {
        tagRes = escapeTags(tags = value.split(spaceRe));
      }
    }

    return  combineTokens( tokens );
  }

  // 支持子模板.
  // 即: compile 子模板, 生成字符串并放到父模板中.
  // @NOTE: compile 生成函数体.
  function include( string, helper ) {
    return '(function() { ' + parseTemplate(string) + '}).call(' + helper + ');';
  }

  // 把模板字符拼接成 JavaScript 函数体.
  function combineTokens( tokens ) {
    var code = "var output = '', helper = this;";
    for ( var i = 0, l = tokens.length; i < l; i++ ) {
      var token = tokens[i];
      if ( !token ) continue;
      var value = token[1];
      var textReg = /text|\^/;
      if ( textReg.test(token[0]) ) {
        value = value.replace( escaper, function( match ) {
          return '\\' + escapes[match];
        });
      }
      if ( value === '' ) continue;
      switch( token[0] ) {
        case 'name':
          code += '\n' + value + '\n';
          break;
        case '>':
          code += "output += " + include( helper.include(value), 'helper' ) + ';';
          break;
        case '=':
          code += "output += helper.escape(" + (value) + ");";
          break;
        case ':=':
          code += "output += helper.unicode(" + (value) + ");";
          break;
        case '&':
          code += 'output += ' + (value) + ';';
          break;
        case 'text':
          code += "output += '" + (value) + "';";
          break;
        default:
          break;
      }
    }
    code += "return output;";
    return code;
  }

  rt.tags = [ "<%", "%>" ];
  rt.cache = {};
  rt.debug = 0;

  function encode( code, base, left, right, length, hijack ) {
    if ( typeof code !== 'string' ) return '';
    base = +base || 16;
    left = typeof left === 'string' ? left : '&#x';
    right = typeof right == 'string' ? right : ';';
    typeof length === 'undefined' && ( length = 3 );
    hijack = typeof hijack === 'function' ? hijack : function() { return; };
    var ret = '', padding = 0;
    for ( var i = 0, l = code.length, char; i < l; i++ ) {
      char = hijack( code.charAt(i) );
      if ( typeof char !== 'string' ) {
        char = ( code.charCodeAt(i) ).toString( base );
        padding = length - String(char).length + 1;
        if ( padding < 1 ) padding = 0;
        char = left + (new Array(padding)).join('0') + char + right;
      }
      ret += char;
      padding = 0;
    }
    return ret;
  }

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
    "/": '&#x2f;',
    "\\": '&#x5c;',
    '%': '&#x0025;'
  };
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/\\%]/g, function( key ) {
      return entityMap[key];
    });
  }

  var helper = {};
  rt.helper = function( key, method ) {
    helper[ key ] = typeof method === 'function' ? method: function() {};
  };
  rt.helper( 'escape', escapeHtml );
  rt.helper( 'include', function( tag ) {
    var dom, string = '';
    try {
      dom = document.getElementById( tag );
      string =  /input|textarea/i.test(dom.nodeName) ? dom.value : dom.innerHTML;
    }
    catch(e){
      if ( rt.debug ) {
        throw e;
      }
    }
    return string;
  });
  rt.helper( 'unicode', function( string ) {
    return encode( string, 16, '\\u', '', 4 );
  });

  rt.compile = function( source, id ) {
    var fn = this.cache[id] || this.cache[source];
    if ( fn ) return fn;
    var tmpl = parseTemplate( source ), render = function() {};
    try { render = new Function( 'it', tmpl ); }
    catch(e) {
      if ( rt.debug ) {
        throw e;
      }
    }
    return this.cache[ id ? id : source ] = render;
  };

  rt.render = function( source, data, id ) {
    var func = this.compile( source, id );
    return func.call( helper, data );
  };

  rt.template = function() {
    return ( arguments.length > 1 ? rt.render : rt.compile ).apply( rt, arguments );
  };

}));
