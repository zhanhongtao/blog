// 1. 判断手机是否安装 微信(4)/微博/QQ/QQZone
// SogouMse.utility.isSupport(function( value ) {
//    (value >> 4 & 1)
// });
// 2. 分享{param}

// String
function escape( input ) {
  return input
    .replace( /&/g, '&amp;')
    .replace( /</g, '&lt;' )
    .replace( />/g, '&gt;' )
    .replace( /"/g, '&#x22;' )
    .replace( /'/g, '&#x27;' );
}

// 'abcd'.replace( /a(b)/, '$1' );

var array = [ 1, 2, 3, 4, 5, 15, 14, 13, 12, 11, 1, 2 ];

// 遍历
function each( array, handle ) {
  for ( var i = 0, l = array.length; i < l; ++i ) {
    try {
        handle( array[i], i, array );
    } catch(e) {
      throw e;
    }
  }
}

each( array, function( item, index, array ) {
  console.log( item, index );
});

// 交换
function swap( array, i, j ) {
  if ( i != j ) {
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

// 反转
console.log( '内置反转 .reverse:', array.reverse() );
function reverse( array ) {
  var i = 0, j = array.length - 1;
  while ( i < j ) {
    swap( array, i, j );
    ++i, --j;
  }
  return array;
}
console.log( '自定义反转: ', reverse(array) );

// 内置排序
array.sort();
console.log( '默认排序: ', array );

array.sort(function(a, b) {
  return a - b;
});
console.log( '从小到大排序: ', array );

array.sort(function(a, b) {
  return b - a;
});
console.log( '从大到小排序: ', array );

array.sort(function() {
  return Math.random() > 0.5 ? 1 : -1;
});
console.log( '随机排序 - 打乱数组: ', array );

array.sort(function(a, b) {
  return a % 2 == 0 ? 1 : b % 2 == 0 ? -1 : 1;
});
console.log( '先奇数再偶数排序: ', array );

array.sort(function(a, b) {
  return a % 2 == 1 ? 1 : b % 2 == 1 ? 1 : -1;
});
console.log( '先偶数再奇数排序: ', array );

// 随机范围 - 整数
function random( min, max ) {
  if ( min == max ) return min;
  if ( min > max ) {
    var tmp = min;
    min = max;
    max = tmp;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 自定义随机排序
function randomSort( array ) {
  each( array, function( item, index, array ) {
    var i = random(0, index);
    swap( array, i, index );
  });
}
randomSort( array );
console.log( '自定义打乱数组: ', array );

console.log( 'input: ', array );

/**
function add(i) {
  if ( i == 10 ) return 10;
  return '' + i + '+' + add(i + 1);
}
function add(i) {
  if ( i == 10 ) return 10;
  return add(i+1) + '+' + i;
}
add(0);
*/

/*
function r( i ) {
  console.log( 'r: ', i );
  if ( i < 3 ) {
    r( i + 1 );
  }
  console.log( 'R: ', i );
}
r( 0, 0 );
*/

// 使用*递归*方法遍历
function print( array, index ) {
  if ( index === array.length ) return;
  print( array, index + 1 );
  console.log( 'print: ', array[index] );
}

console.log( 'PRINT input: ', array );
print( array, 0 );

function merge( a, b ) {
  var ret = [], m = a.length, n = b.length;
  for ( var i = 0, j = 0; i < m && j < n; ) {
    if ( a[i] > b[j] ) {
      ret.push( b[j] );
      ++j;
    } else {
      ret.push( a[i] );
      ++i;
    }
  }

  while ( i < m ) {
    ret.push( a[i] );
    ++i;
  }

  while ( j < n ) {
    ret.push( b[j] );
    ++j;
  }
  return ret;
}

var a = [ 1, 3, 5, 6, 7 ];
var b = [ 0, 2, 4, 9 ];
// 0, 1, 2, 3, 4, 5, 6, 7, 9
console.log( '测试合并: ', merge( a, b ) );

function mergeSort( array ) {
  if ( array.length <= 1 ) return array;
  var position = Math.floor(  array.length/2 );
  var a = array.slice( 0, position );
  var b = array.slice( position );
  return merge(
    mergeSort(a),
    mergeSort(b)
  );
}

var mergeResult = mergeSort( array );
console.log( '归并排序结果: ', mergeResult );


console.log( '准备插入排序数据: ', array );
function insertSort( array ) {
  if ( array.length == 0 ) return [];
  for ( var i = 1, l = array.length; i < l; ++i ) {
    var tmp = array[i];
    for ( var j = i - 1; j >= 0; --j ) {
      if ( array[j] > tmp ) {
        array[j + 1] = array[j];
      } else {
        break;
      }
    }
    if ( j + 1 != i ) {
      array[j+1] = tmp;
    }
  }
  return array;
}
var insertResult = insertSort( array );
console.log( '插入排序结果: ', insertResult );

// 选择: 每次和上次不同.
randomSort( array );
console.log( 'list: ', array );
function randomList( list, n ) {
  var ret = [];
  var _list = [].concat( list );
  var l = _list.length - 1;
  while ( n > 0 ) {
    var i = random( 0, l - 1 );
    swap( _list, i, l );
    ret.push( _list[l] );
    --n;
  }
  return ret;
}
console.log( '选择 3 个元素: ', randomList( array, 3 ) );
function randomSelect( list, n ) {
  var array = [].concat( list );
  var l = list.length - 1;
  var ret = [];
  while ( n > 0 ) {
    var i = random( 0, l );
    swap( array, i, l );
    ret.push( array[l] );
    --n;
    --l;
  }
  return ret;
}
console.log( '选择4个不同元素: ', randomSelect(array, 4) );

randomSort(array)
console.log( '初始化数组: ',  array );

function quickSort( list, low, high ) {
  if ( low >= high ) return;
  var pos = random(low, high);
  // 选基数
  var pivot = list[pos];
  swap( list, pos, high );
  var i = low, j = high;
  while ( 1 ) {
    // 找左侧的大值
    while ( i < j && list[i] <= pivot ) {
      ++i;
    }
    // 找右侧的小值
    while( i < j && list[j] >= pivot ) {
      --j;
    }
    if ( i >= j ) break;
    swap( list, i, j );
  }
  swap( list, high, j );
  quickSort( list, low, j - 1);
  quickSort( list, j + 1, high );
}

randomSort( array );
quickSort( array, 0, array.length - 1 );
console.log( '快排结果: ', array );

