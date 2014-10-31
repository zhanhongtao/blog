function type( n ) {
  return Object.prototype.toString.call( n ).slice( 8, -1 ).toLowerCase();
}

function each( obj, handle ) {
  if ( type(obj) == 'object' ) {
    for( var key in obj ) {
      if ( handle(obj[key], key, obj) === false ) {
        return;
      }
    }
  } else {
    for ( var i = 0, l = obj.length; i < l; ++i ) {
      if ( handle(obj[i], i, obj) === false ) {
        return;
      }
    }
  }
}

// 交换数组中 i/j 位置数据
function swap( array, i, j ) {
  if ( i == j )return;
  var t = array[i];
  array[i] = array[j];
  array[j] = t;
}

// 创建 n 个元素组成的, 值全为 k 的数组
function fill( n, value ) {
  var ret = [];
  while ( n-- ) {
    ret.push( value );
  }
  return ret;
}

// 扁平化 Array - [ 1, [2, 3], [4,[5]] ] -> [ 1, 2, 3, 4, 5 ]
function flatten( array ) {
  var i = 0, l = array.length, ret = [];
  for ( ; i < l; ++i ) {
    var c = array[i];
    if ( type(c) == 'array' ) {
      [].push.apply( ret, flatten(c) );
    } else {
      ret.push( c );
    }
  }
  return ret;
}

// 实现数组的 [].reverse 方法
function reverse( array ) {
  var i = 0, l = array.length;
  for ( var i = 0, j = array.length - 1; i < j; ++i, --j ) {
    if ( i < j ) {
      swap( array, i, j );
    }
  }
}

// 求最大值
function max() {
  return Math.max.apply( Math, flatten(arguments) );
}

// 求最小值
function min( array ) {
  return Math.min.apply( Math, flatten(arguments) );
}

// 随机出数组中 n 个数.
function getRandomTop( array, n ) {
  var ret = [], l = array.length;
  while ( n-- ) {
    var i = Math.floor( Math.random() * l );
    swap( array, i, --l );
    ret.push( array[l] );
  }
  return ret;
}

// 打乱数据
function shuffle( array ) {
  for ( var i = 0, l = array.length, rand; i < l; ++i ) {
    rand = Math.floor( Math.random() * i );
    if ( rand != i ) swap( array, rand, i );
  }
}

// 使用递归方法, 顺序打印和倒序打印数组元素
function logA( array, i ) {
  if ( i >= 0 ) {
    console.log( array[i] );
    logA( array, i - 1 );
  }
}
function logB( array, i ) {
  if ( i >= 0 ) {
    logB( array, i - 1 );
    console.log( array[i] );
  }
}

// 去除重复数据
function unique( array ) {
  var map = {}, ret = [];
  each(function( item, index, array ) {
    if ( !map[item] ) {
      map[item] = true;
      ret.push(item);
    }
  });
  return ret;
}

// 扩展一个reverseList函数，该函数使[1,[2,[3,null]]] 返回 [3,[2,[1, null]]]
Array.prototype.reverseList = function() {
  var result = null, list = this;
  while ( list && list.length ) {
      var item = list.shift();
      list = list.shift();
      result = [ item, result ];
  }
  return result ? result : this;
};

// 输入一个整数数组, 调整数组中数字的顺序, 使得所有奇数位于数组的前半部分.
function sortA( array ) {
  var i = 0, j = 0, length = array.length;
  while (1) {
    while ( i < length && array[i] % 2 !==  0 ) {
      ++i;
    }
    j = i + 1;
    while ( j < length && array[j] % 2 === 0 ) {
      ++j;
    }
    if ( i < length && j < length ) {
      swap( array, i, j );
      ++i, ++j;
    } else {
      break;
    }
  }
}

// 求数组中出现次数超过一半的元素
function findValueOverHalf( array ) {
  var value, number;
  each( array, function( item ) {
    if ( !value ) {
      value = item, number = 1;
    } else if ( value != item ) {
      --number;
      if ( number === 0 ) {
        value = null;
      }
    } else {
      ++number;
    }
  });
  return value;
}

// 合并两个有序的数组
function combinArray( a, b ) {
  var ret = [], i = 0, al = a.length, j = 0, bl = b.length;
  if ( al == 0 ) {
    return b;
  } else if ( bl == 0 ) {
    return a;
  } else {
    while( i < al && j < bl ) {
      if ( a[i] > b[j] ) {
        ret.push( b[j] );
        ++j;
      } else if ( a[i] < b[j] ) {
        ret.push( a[i] );
        ++i;
      } else {
        ret.push( a[i], b[j] );
        ++i, ++j;
      }
    }
    if ( i < al ) {
      [].push.apply( ret, a.slice(i) );
    } else if ( j < bl ) {
      [].push.apply( ret, b.slice(j) );
    }
    return ret;
  }
}

// 找出数组中特定的元素, 它比左边的元素都大, 比右边元素都小
function find( array ) {
  var min = [];
  var max = array[0];
  var mi = 0;
  for ( var i = 1, l = array.length - 1; i < l; i++ ) {
    var c = array[i];
    if ( c > max ) {
      min[mi++] = c;
      max = c;
    }
    else {
      for ( var j = min.length; j >= 0; j-- ) {
        if ( c <= min[j] ) {
          min.pop();
          mi--;
        }
      }
    }
  }
  return min;
}
[ 1, 8, 7, 5, 10, 12 ]
// 快速排序和插入排序算法 js 描述
// 求数组中第 K 大/小的值

// 合并对象
function mixin(des, src, map){
  if(typeof des !== 'object' 
    && typeof des !== 'function'){
    throw new TypeError('Unable to enumerate properties of '+ des);
  }
  if(typeof src !== 'object' 
    && typeof src !== 'function'){
    throw new TypeError('Unable to enumerate properties of '+ src);
  }

  map = map || function(d, s, i, des, src){
    // 这里要加一个des[i]，是因为要照顾一些不可枚举的属性
    if(!(des[i] || (i in des))){
      return s;
    }
    return d;
  }

  if(map === true){ //override
    map = function(d,s){
      return s;
    }
  }

  for (var i in src) {
    des[i] = map(des[i], src[i], i, des, src);
    //如果返回undefined，尝试删掉这个属性
    if(des[i] === undefined) delete des[i]; 
  }
  return des;       
}
