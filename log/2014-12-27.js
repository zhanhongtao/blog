/*
  对如何做测试有概念.
  尽可能的让自己想的更完善.
  * assert 函数 - 同步/异步

  完善动画函数
  * jQuery.easing http://gsgd.co.uk/sandbox/jquery/easing/
  ../ppt/demo/fx.js
  ../ppt/demo/easing.js

  * heapsort
  * 求第K大/小值.

  * http://bonsaiden.github.io/JavaScript-Garden/zh/
*/

// 到 100 会自动结束
var x = 0, max = 100;
var t = new Date();
var timer = setInterval(function() {
  x += ( max - x ) * 0.2;
  x = Math.ceil(x);
  if ( x >= max ) {
    x = max;
    clearInterval( timer );
  }
  console.log( x, new Date - t );
});


function heapSort( array ) {
  buildMaxHeap( array );
  for ( var i = array.length - 1; i >= 0; --i ) {
    swap( array, 0, i );
    adjustHeap( array, 0, i );
  }
}

function buildMaxHeap( array ) {
  for ( var length = array.length, i = Math.floor(length/2) - 1; i >= 0; --i ) {
    adjustHeap( array, i, length );
  }
}

function adjustHeap( array, i, j ) {
  var large = i;
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  if ( left < j && array[left] > array[large] ) {
    large = left;
  }
  if ( right < j && array[right] > array[large] ) {
    large = right;
  }
  if ( large != i ) {
    swap( array, large, i );
    adjustHeap( array, large, j );
  }
}

function swap( array, i, j ) {
  if ( i != j ) {
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}
