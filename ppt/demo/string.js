function startsWith( string, sub ) {
  return string.indexOf( sub ) == 0;
}

function endsWith( string, sub ) {
  return string.lastIndexOf( sub ) === string.length + 1;
}

function repeat( string, times ) {
  var array = new Array( times + 1 );
	return array.join( string );
}

function count( string, substring ) {
  var n = 0, i = 0;
	while ( string.indexOf( substring, i ) > -1 ) {
	  ++n;
	}
	return n;
}

funtion isLowerCase( string ) {
  return string.toLowerCase() === string;
}

function isUpperCase( string ) {
  return string.toUpperCase() === string;
}

function isLowerCase( chr ) {
  var code = chr.charCodeAt(0);
	return code >= 96 && code <= 122;
}

// 小写字母转换为大写(逆运算)
// @不支持汉字.
function toLowerCase( string ) {
  var low = 65, high = 122, delta = 97 - 65;
  var i = 0, l = string.length, cur, chr, status = false;
  var ret = [];
  while ( i < l ) {
    cur = string.charCodeAt( i );
    status = cur >= low && cur >= high;
    if ( status ) {
      chr = String.fromCharCode(cur + delta);
    }
    ret.push( status ? chr : string[i] );
    ++i;
  }
  return ret.join( '' );
}

// 把 tab 替换成空格
function convertTabToSpace( string ) {
  return String( string ).replace( /\t/g, ' ' );
}

// 转换 html 标签 - HTML 支持实体 + &#十进制 + &#十六进制
function escapeHTML( html ) {
  return String( html )
    .replace( /&/g, '&amp;' )
    .replace( /</g, '&lt;' )
    .replace( />/g, '&gt;' );
}

// 查找第一个唯一字符
function findFirstOnlyChar( string ) {
  var array = String(string).split('');
  for ( var i = 0, l = array.length; i < l; ++i ) {
    var chr = array[i];
    if ( string.indexOf(chr) === string.lastIndexOf(chr) ) {
      return chr;
    }
  }
  return '';
}

// 解析 Query 字符串
function parseURLString( string ) {
  string = string.trim();
  var index = 0, flag = -1,
  length = string.length, 
  result = {}, 
  key = '', value = '';
  if ( string.length === 0 ) return result;
  while ( index < length ) {
    var ichar = string[index++];
    switch( ichar ) {
      case '=':
        if ( flag === 0 ) {
          flag = 1;
        }
        break;
      case '&':
        if ( flag !== -1 ) {
          if ( result[key] ) {
            result[ key ] = [].concat( result[key], value );
          }
          else result[key] = value;
        }
        flag = -1;
        key = value = '';
        break;
      default:
        if ( flag === -1 ) {
          flag = 0;
        }
        if ( flag === 1 ) {
          value += ichar;
        }
        else {
          key += ichar;
        }
    }
  }
  if ( flag !== -1 ) {
    if ( result[key] ) {
      result[ key ] = [].concat( result[key], value );
    }
    else result[key] = value;
  }
  return result;
}

// 实现 KMP 算法.
function createIndexes( string ) {
  var p = [0];
  var j = -1;
  for ( var i = 1, l = string.length; i < l; i++ ) {
    while( j > 0 && string[j+1] !== string[i] ) {
      j = p[j];
    }
    if ( string[j+1] == string[i] ) {
      j++;
    }
    p[i] = j;
  }
  return p;
}

function indexOf( string, str, pos ) {
  var j = -1
  var s = str.length
  var k = createIndexes( str )
  var r = -1
  for ( var i = pos || 0, l = string.length; i < l; i++ ) {
    while ( j > 0 && str[j+1] != string[i] ) {
      j = k[j]
    }
    if ( str[j+1] == string[i] ) {
      j++
    }
    if ( j >= s - 1 ) {
      r = i - j
      break
    }
  }
  return r
}
// 以上实现 indexOf 方法.

// 向回找到正确匹配的位置.
function backMatchPattern( string, pattern, a, b, array ) {
  // 不匹配时, 返回 -1.
  if ( array.length === 0 ) return -1;
  // 记录最后一次 ? 位置.
  var pos = array.pop();
  var old = a;
  while ( b > pos ) {
    var chara = string.charAt(a),
        charb = pattern.charAt(b);
    // 如果相等, 继续向前匹配.
    if ( chara !== charb ) {
      break;
    }
    --b;
    --a;
  }
  return b === pos ? old : backMatchPattern( string, pattern, a - 1, b, array );
}

// pattern 只存在 ? 特殊符号.
// 目前不考虑 \? \\ 等特殊符号.
function matchPattern( string, pattern, start ) {
  var a = start || 0, b = 0;
  var alength = string.length, blength = pattern.length;
  var array = [];
  var ret = true;
  while ( a < alength && b < blength ) {
    var achar = string.charAt(a), bchar = pattern.charAt(b);
    // 遇到特殊字符
    // 默认认为匹配任意一个字符.
    // ? 代表匹配任意一个字符或空字符.
    if ( bchar === '?' ) {
      // 记录 ? 位置, 以备返回.
      array.push( b );
      ++a;
      ++b;
      continue;
    }
    // 字符匹配.
    if ( achar === bchar ) {
      ++a;
      ++b;
      continue;
    }
    // 不匹配情况下..
    if ( achar !== bchar ) {
      // 之前不存在 ? 字符, 结束.
      if ( array.length === 0 ) {
        ret = false;
        break;
      }
      else {
        a = backMatchPattern( string, pattern, a - 1, b, array );
        if ( a === -1 ) {
          ret = false;
          break;
        }
      }
    }
  }
  return ret;
}

// test
// var string = 'http://www.baidu.com/';
// var sub = 'http://?ww.baidu?.com/';
// console.log( matchPattern(string, sub) );
