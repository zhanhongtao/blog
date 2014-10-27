var DEBUG = {
  error: 1
};

var Line = {
  // 空白行
  empty: 'empty',
  // 普通文本行
  text: 'text',
  // 标题行
  title: 'title',
  // == 等号行 -> 匹配标题
  equals: 'equals',
  // __ 下划线行 -> 匹配标题
  underline: 'underline',
  // * 星号行 -> 匹配 hr
  star: 'star',
  // - 减号行 -> 匹配 hr
  minus: 'minus',
  // > 引用行
  blockquote: 'blockquote',
  // >> 子引用行
  subblockquote: 'subblockquote',
  // 有序列表行
  orderlist: 'orderlist',
  // 无序列表行
  unorderlist: 'unorderlist',
  // 代码块
  code: 'code',
  // 注解行.
  comment: 'comment'
};

// 单号语法解析
var lineScanner = (function() {
  var lineRegExp = [
    [ Line.empty, /^\s*$/ ],
    [ Line.title, /^\s*#+/ ],
    [ Line.equals, /^\s*==/ ],
    [ Line.underline, /^\s*__/ ],
    [ Line.star, /^\s*\*{3,}\s*$/ ],
    [ Line.minus, /^\s*\-{6,}\s*$/ ],
    [ Line.blockquote, /^\s*> / ],
    [ Line.subblockquote, /^\s*>> / ],
    [ Line.orderlist, /^\s*[0-9]+\. / ],
    [ Line.unorderlist, /^\s*\* / ],
    [ Line.code, /^\s*```/ ],
    [ Line.comment, /^\s*\[[^\]]+\]\:\s*[^\ ]+(\s+.+)?$/ ]
  ];
  var parse = function( src ) {
    var tokens = [];
    var rawLines = src.split( '\n' );
    for ( var i = 0, l = rawLines.length; i < l; ++i ) {
      var rawLine = rawLines[i];
      var token = { type: Line.text, text: rawLine };
      for ( var j = 0, n = lineRegExp.length; j < n; ++j ) {
        if ( lineRegExp[j][1].test( rawLine ) ) {
          token.type = lineRegExp[j][0];
          break;
        }
      }
      tokens.push( token );
    }
    return tokens;
  };
  return { parse: parse };
})();

// 多行依赖语法解析
var blockParser = (function() {

  function is( type ) {
    return function( lines, index ) {
      return ( lines.length > index && lines[index].type === type ) ?
        { status: true, delta: 1, token: lines[index], command: 'is' } : { status: false };
    }
  }

  function not( type ) {
    return function( lines, index ) {
      return ( lines.length > index && lines[index].type === type ) ?
        { status: false } : { status: true, delta: 1, token: lines[index], command: 'not' };
    };
  }

  function or() {
    var actions = arguments;
    return function( lines, index ) {
      for ( var i = 0, l = actions.length; i < l; ++i ) {
        var action = actions[i];
        var _r = action( lines, index );
        if ( _r.status === true ) {
          return { status: true, delta: _r.delta, children: [_r], command: 'or' }
        }
      }
      return { status: false }
    };
  }

  function queue() {
    var actions = arguments;
    return function( lines, index ) {
      var oldindex = index, children = [];
      for ( var i = 0, l = actions.length; i < l; ++i ) {
        var action = actions[i];
        var _r = action( lines, index );
        if ( _r.status === false ) {
          return { status: false, command: 'queue' }
        } else {
          index += _r.delta;
          children.push( _r );
        }
      }
      return { status: true, delta: index - oldindex, children: children, command: 'queue' };
    };
  }

  function repeat( action, min, max ) {
    max = max == null ? 10000 : max;
    min = min == null ? 0 : min;
    return function( lines, index ) {
      var oldindex = index, children = [];
      while ( index < lines.length && children.length < max ) {
        var _r = action( lines, index );
        if ( _r.status === false ) {
          return children.length < min ? { status: false } : {
            status: true,
            delta: index - oldindex,
            children: children,
            command: 'repeat'
          };
        } else {
          children.push( _r );
          index += _r.delta;
        }
      }
      return { status: true, delta: index - oldindex, children: children, command: 'repeat' };
    };
  }

  var _grammar = [
    [ is( Line.empty ), 'empty' ],
    [ is( Line.title ), 'title' ],
    [ queue(
        is(Line.text),
        is(Line.equals)
      ), 'title' ],
    [ queue(
        is(Line.text),
        is(Line.underline)
      ), 'title' ],
    [ is(Line.star), 'hr' ],
    [ is(Line.minus), 'hr' ],
    [ queue(
        is(Line.blockquote),
        repeat(
          or(
            is(Line.text),
            is(Line.blockquote),
            is(Line.subblockquote)
          ), 0)
      ), 'blockquote' ],
    [ repeat( or(
        is(Line.orderlist),
        is(Line.unorderlist)
      ), 1), 'list'],
    [ queue(
        is(Line.code),
        repeat( not(Line.code), 0 ),
        is(Line.code)
      ), 'code' ],
    [ is( Line.comment ), 'comment' ],
    [ is( Line.text ), 'text' ]
  ];

  function _parse( lines, _grammar ) {
    var r = [];
    var i, l = _grammar.length, index = 0, length = lines.length;
    while ( index < length ) {
      i = 0;
      for ( ; i < l; ++i ) {
        var grammar = _grammar[i];
        var _r = grammar[0]( lines, index );
        if ( _r.status === true ) {
          index += _r.delta;
          _r.rule = grammar[1];
          r.push( _r );
          break;
        }
      }
      if ( i === l ) {
        console.error( index, lines[index] );
        throw 'error';
      }
    }
    return r;
  }

  return {
    parse: function( lines ) {
      return _parse( lines, _grammar );
    }
  };

})();

// HTML!
var htmlcreateor = (function() {
  var globalComments = {};

  function inlineText( text ) {
    text = text
      .replace( /~([^~]+?)~/g, '<mark>$1</mark>' )
      .replace( /\*([^\*]+?)\*/g, '<em>$1</em>' )
      .replace( /_([^_])_/g, '<em>$1</em>' )
      .replace( /\*\*([^\*]+?)\*\*/g, '<strong>$1</strong>' )
      .replace( /__([^_]+?)__/g, '<strong>$1</strong>' )
      .replace( /\*\*\*([^\*]+?)\*\*\*/g, '<strong><em>$1</em></strong>' )
      .replace( /___([^_]+?)___/g, '<strong><em>$1</em></strong>' )
      .replace( /\!\[([^\]]+?)\]\(([^\)]+?)\)/, '<img src="$2" alt="$1" />' )
      .replace( /\[([^\]]+?)\]\(([^\)]+?)\)/g, '<a href="$2">$1</a>');
    return text;
  }

  function _empty( item ) {
    return '<br />';
  }

  function _hr( item ) {
    return '<hr class="' + item.token.type + '" />';
  }

  function _title( item ) {
    var h = 1, title = '';
    if ( item.children ) {
      var children = item.children;
      h = children[1].token.type == 'equals' ? 1 : 2;
      title = children[0].token.text;
    } else {
      var token = item.token;
      var text = token.text.trim();
      var index = text.search( /(?!#)/ );
      h = index;
      title = text.slice( index );
    }
    return '<h' + h + '>' + inlineText(title) + '</h' + h + '>';
  }

  function _text( item ) {
    return '<p>' + inlineText(item.token.text) + '</p>';
  }

  function _list( item ) {
    function _li( current ) {
      if ( current.children ) {
        return _li( current.children[0] );
      } else {
        var token = current.token;
        // 根据空格的个数计算缩进数.
        var sub = token.text.search( /(?! )/ ) / 2;
        return ( token.sub = sub, token );
      }
    }

    var html = [];
    var status = [];
    var i = 0, lis = item.children, l = lis.length, c, lt, length;
    for ( ; i < l; ++ i ) {
      c = _li( lis[i] );
      length = status.length;
      lt = status[ length - 1];
      if (
        length === 0 ||
        !(lt.type == c.type && lt.sub == c.sub)
      ) {
        html.push( c );
        status.push( c );
      }
      html.push( c.text );
    }

    var r = [], t = [], type;
    for ( var i = 0, j = 1, l = html.length; i < l; ++i, ++j) {
      var current = html[i], next = html[j];
      // 普通 li
      if (
        typeof current == typeof next ||
        ( typeof current == 'string' && typeof next == 'undefined' )
      ) {
        r.push( '<li>' + current + '</li>' );
      }
      // 子 ul/ol 开始
      else if ( typeof next == 'object' ) {
        r.push( '<li>' + current );
        t.push( '</li>' );
      }
      // 新 ul/ol
      else if ( typeof next == 'string' ) {
        if ( t.length && typeof t[t.length - 1] == 'string' ) {
          r.push( t.pop() );
        }
        if ( t.length && current.sub < t[t.length-1].sub ) {
          type = t.pop();
          r.push( type == 'orderlist' ? '</ol>' : '</ul>' );
        } else {
          type = current.type == 'orderlist' ? 'ol' : 'ul';
          r.push( '<' + type + '>' );
          t.push( current );
        }
      }
    }
    while( t.length ) {
      var current = t.pop();
      type = current.type == 'orderlist' ? 'ol' : 'ul';
      r.push( '</' + type + '>' );
    }
    return r.join('');
  }

  function _blockquote( item ) {
    function _fix( item ) {
      var html = [];
      if ( item.children ) {
        item.children.forEach(function( item ) {
          Array.prototype.push.apply( html, _fix(item) );
        });
      } else {
        html.push( item.token.text );
      }
      return html;
    }
    var html = _fix( item );
    return html.join( '' );
  }

  function _code( item ) {

    function _fix( item ) {
      var html = [];
      if ( item.children ) {
        item.children.forEach(function( item ) {
          Array.prototype.push.apply( html, _fix(item) );
        });
      } else {
        html.push( item.token.text );
      }
      return html;
    }

    var children = item.children;
    var start = children[0];
    var length = children.length;
    var r = [];
    r.push( '<pre class="' + start.token.text.replace(/`/g, '') + '">' );
    r.push( '<code>' );
    var i = 1;
    while ( i < length - 1 ) {
      r.push( _fix(children[i]).join('\r\n') );
      ++i;
    }
    r.push( '</code>' );
    r.push( '</pre>' );
    return r.join( '' );
  }

  function _comment( item ) {
    var text = item.token.text;
    if ( text ) {
      text.replace( /^\s*\[([^\]]+)\]\:\s*([^\ ]+)(?:\s+(.+))?$/, function( match, id, url, title ) {
        globalComments[ id ] = {
          id: id,
          url: url,
          title: title
        };
      });
    }
  }

  function handle( item ) {
    switch( item.rule ) {
      case 'title':
        return _title( item );
        break;
      case 'empty':
        return _empty( item );
        break;
      case 'hr':
        return _hr( item );
        break;
      case 'text':
        return _text( item );
        break;
      case 'list':
        return _list( item );
        break;
      case 'blockquote':
        return _blockquote( item );
        break;
      case 'code':
        return _code( item );
        break;
      default:
        break;
    }
  }

  function create( ast ) {
    ast = ast.filter(function( item ) {
      if ( item.rule == 'comment' ) {
        _comment( item );
      } else {
        return true;
      }
    });
    var html = [], _html = [];
    for ( var i = 0, l = ast.length; i < l; ++i ) {
      var item = ast[i];
      _html = handle( item );
      if ( _html ) {
        html.push( _html );
      }
    }
    return html;
  }

  return {
    create: create
  };
})();

var compile = function( text ) {
  var lex = lineScanner.parse( text );
  var ast = blockParser.parse( lex );
  var html = htmlcreateor.create( ast );
  return html;
};

