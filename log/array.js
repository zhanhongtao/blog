
0x00 初始化
var array  = [];
var array = ['1', true, 1];
var array = new Array();
var array = new Array(10); // 尝试负值和浮点数
var array = new Array('10');

// 二维数组
var array = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
];

0x01 属性和方法
var array = [0, 1, 2, 3, 4, 5];
array.length;     // 6
array.length = 0; // array = [];

array.push('a');          // 1; array = ['a']
array.push('b');          // 2; array = ['a', 'b']
array.unshift('0');       // 3; array = ['0', 'a', 'b'];
array.pop();              // 'b'; array = ['0', 'a'];
array.shift();            // '0'; array = ['a'];

array = [0, 1, 2, 3, 4, 5, 6 ];
var tmp = array.slice(2, 4);    // tmp = [2, 3]; array 不变
tmp = array.slice(3, -1);       // tmp = [3, 4, 5]; array 不变

var array = [3, 4, 5];
var other = ['a', 'b'];
var result = array.concat(other);
// result = [3, 4, 5, 'a', 'b']
// array = [3, 4, 5];
// other = ['a', 'b']
result = result.concat('c'); // result = [3, 4, 5, 'a', 'b', 'c']

tmp = array.splice(4);       // tmp = [4, 5, 6]
tmp = array.splice(2, 1);    // tmp = [2]; array = [0, 1, 3]
tmp = array.splice(2, 0, 2); // tmp = []; array = [0, 1, 2, 3]

var string = array.join();   // string = 0,1,2,3
string = array.join('-');    // string = 0-1-2-3;  string.split 方法对应

array.reverse();            // array = [3, 2, 1, 0]

array = [1, 2, 11, 12];
array.sort(); // array = [1, 11, 12, 2] -> 从小到大排序; 按字符大小
array.sort(function(a, b) {
  return a - b > 0 ? 1 : a == b ? 0 : -1; // -1: 靠前; 0: 相等; 1: 靠后
}); // array = [1 , 2, 11, 12]
array.sort(function() {
  return Math.random() > 0.5; // 简单随机排序; Math.random() 表示随机生成一个 (0, 1) 之间的数
});

0x02 遍历数组
var array = [0, 1, 2, 3, 4];
for (var i = 0, l = array.length; i < l; ++i) {
  var item = array[i];
  console.log(item);
}

var i = 0, l = array.length, item;
while(i < l) {
  item = array[i];
  ++i;
}

function forEach(array, handle) {
  for (var i = 0, l = array.length; i < l; ++i) {
    handle(array[i], i, array);
  }
}

function forEach(array, handle, reverse) {
  for (var i = 0, l = array.length; i < l; ++i) {
    var index = reverse ? l - i - 1 : i;
    handle(array[index], index , array);
  }
}

function forEach(array, handle, reverse) {
  for (var i = 0, l = array.length; i < l; ++i) {
    var index = reverse ? l - i - 1 : i;
    var ret = handle(array[index], index , array);
    if (ret === false) {
      break;
    }
  }
}

0x03 查找(二分查找)
var array = [0, 1, 2, 3, 4, 5, 6];
var value = 2;
var index = -1;
forEach(array, function(item, i) {
  if (value === item) {
    index = i;
    return false;
  }
});
console.log(index);

function indexOf(array, value) {
  var index = -1;
  forEach(array, function(item, i) {
    if (item === value) {
      index = i;
      return false;
    }
  });
  return index;
}

0x04 ES5
var array = [0, 1, 2, 3, 4, 5, 6];
// .indexOf
array.indexOf(4); // 4
// .lastIndexOf
array.lastIndexOf(1); // 1;
// .forEach
array.forEach(function(item, index, array) {
  // @todo.
});
// .every
var boolean = array.every(function(item, index, array) {
  if (item % 2 === 0) {
    return true;
  }
});
// .some
var boolean = array.some(function(item, index, array) {
  return item % 5 === 0;
});
// .map
var newArray = array.map(function(item, index, array) {
  return item * 2;
}); // newArray = [0, 2, 4, 6, 8, 10, 12]
// .filter
var newArray = array.filter(function(item, index, array) {
  return item % 2 === 0;  
}); // newArray = [0, 2, 4, 6]
// .reduce
var value = array.reduce(function(base, item) {
  return base + item;
}); // 0 + 1 + 2 + 3 + 4 + 5 + 6 = 21;
value = array.reduce(function(base, item) {
  return base + item;
}, 10); // 31;
// .reduceRight

// Array.isArray
Array.isArray(array); // true;

0x05 数组对象
array.name = 'Array';
array.getName = function() {
  return array.name;
};

0x06 作业
实现 js 内置的 every, some, filter, map, reduce 方法

