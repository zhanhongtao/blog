/**
  * 在开发者工具中直接修改代码, 并且直接保存到源文件中.
  * 递归 -> 冒泡方式遍历节点/回忆 print 方法
  * List -> 选 A, 再全选 -> A,Others 保证顺序; 或者直接反选;
  * 回顾 Array 习题.
  * 字符串表示 - 怎么表示: a;
  * 常见 ASCII 码回顾.
  * HTML escape
  * slice/replace 详解
  * 字符串(URL) 转换为对象
  * 反转字符串
  * queue 实例 - 使用.
*/

var list = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
// var list = [ {}, {}, {} ];

// 1.
var selectedList = [ 1, 5 ];
// 求: 没被选中的项目.

// 2.
var selectedList = [ 1, 5 ];
// selectedAll();
// 求出: [ 1, 5, 2, 3, 4, 6, 7, 8, 9, 10 ];

// 需要借助 Helper 哈希空间.
// 目的: 节省查找时间.

var selectedList = [];

// helper 表示, 有没有选中
var helper = {};
list.forEach(function( item ) {
  helper[ item ] = false;
});

function getReverseList() {
  var ret = [];
  list.forEach(function( item ) {
    if ( !helper[item] ) {
      ret.push( item );
    }
  });
  return ret;
}

function insert( value ) {
  selectedList.push( value );
  helper[ value ] = true;
}

function remove( value ) {
  helper[value] = false;
}

// 1. insert
insert( value );
// 2. remove
remove( value );
// 3. get
// 参考结果.
function getSelectedUnOrder() {
  var ret = [];
  list.forEach(function( item ) {
    if ( helper[item[ ) {
      ret.push( item );
    }
  });
  return ret;
}

function get() {
  var ret = [];
  for ( var n = selectedList.length; n > 0; --n ) {
    var item = selectedList[n];
    if ( helper[item] ) {
      ret.push( item );
    } else {
      selectedList.splice( n, 1 );
    }
  }
  return ret.reverse();
}

// var unselectedList = [];

// insert
  // -> before check!
  // -> indexOf
  // -> Hash 查找 - helper
      // -> exist
        // -> delete
      // -> no
        // -> push
// delete
// reverst
function revert( all, part ) {
  var helper = {};
  part.forEach(function( item ) {
    helper[item] = true;
  });
  var ret = [];
  all.forEach(function( item ) {
    if ( !helper[item] ) {
      ret.push( item );
    }
  });
  return ret;
}




// 把字符串中的\t转换为 2 个空格
var string = '...';
string = string.replace( /\t/g, '  ' );
// string.replace( regexp, str );

var queryString = 'a=a&b=b';
// a=&b=
queryString = queryString.replace( /=([^&]*)/g, '=' );

var queryString = 'X=&a=x&b=y&C=&d=z&E=&F=';
// a=x&b=y&d=z
queryString = queryString.replace( /^[^=&]+=(?:&|$)|&[^=&]+=(?=&|$)/g, '' );
console.log( queryString );

var number = '123456670';
// 123,456,670
number = number.replace( /\d(?=(?:\d{3})+$)/g, '$&,' );
console.log( number );

var string = 'abc123abc2323a33a';
// 'abc 123 abc 2323 a 33 a'
string = string.replace( /[a-z](?=[0-9])|[0-9](?=[a-z])/g, '$& ' );
console.log( '"' + string + '"' );

// @Note: Error!
var string = 'abc123abc2323a33aa';
string = string.replace( /([a-z]+|[0-9]+)(?!$)/g, '$& ' );
console.log( '"' + string + '"' );


var queryString = 'X=&a=x&b=y&C=&d=z&E=&F=';
// {x: undefined,a: 'x',....}
var object = {};

// 1.
var tmpArray = queryString.split( '&' );
tmpArray.forEach(function( item ) {
  var tmp = item.split( '=' );
  object[ tmp[0] ] = tmp[1];
});

// 2.
queryString.replace( /([^&=]+)=([^&]*)/g, function( match, key, value, index, all ) {
  console.log( 'match: ', match, '; index: ', index );
  object[key] = value == '' ? void 0 : value;
});
console.log( object );

// 3.
var _ = queryString.replace( /([^&=]+)=([^&]*)/g, function( match, key, value, index, all ) {
  console.log( 'match: ', match );
  if ( value == '' ) {
    value = '_';
  }
  return key + '=' + value;
});
console.log( _ );


var htmlString = '<h1>Hello \'World\"</h1>';
htmlString
  .replace( /&/g, '&amp;' )
  .replace( /</g, '&lt;' )
  .replace( />/g, '&gt;' )
  .replace( /'/g, '&#x27;' )
  .replace( /"/g, '&#x22;' );

// @todo: document.write( '&gt;' );



var string = 'Hello world';
// output: world Hello

// 1.
string.split( /\b/g ).reverse().join( ' ' );

// 2.
// Hello  world;
string.split( /(\b)/g ).reverse().join();

var string = 'Hello world';
// output: olleH dlrow;

// 1.
string.split( /\b/g ).forEach(function( word ) {
  word.split().reverse().join('');
}).join(' ');

// 2.
function reverseWord( string ) {
  var stack = [], ret = '';
  var i = 0, l = string.length;
  while ( i <= l ) {
    if ( string[i] && string[i] != ' ' ) {
      stack.push( string[i] );
    } else {
      while ( stack.length ) {
        ret += stack.pop();
      }
      if ( i != l ) {
        ret += string[i];
      }
    }
    ++i;
  }
  return ret;
}

reverseWord( 'Hello World' );

// @todo.
// 空白: &nbsp;

