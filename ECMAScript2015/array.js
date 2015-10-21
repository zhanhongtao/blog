'use strict';

/*!
  // 侦听
  Array.observe()
  Array.unobserve()

  // 迭代器
  Array.prototype.keys
  Array.prototype.values
  Array.prototype.entries

  // Es7
  // 表示某个数组是否包含给定的值
  Array.prototype.includes(value[, startIndex]);
*/


// https://googlechrome.github.io/samples/array-methods-es6/index.html

// 不再需要 [].slice.call 方法
// string - 内置拆分算法, 修正多字节问题
Array.from('abc'); // -> ['a', 'b', 'c']
// NodeList
Array.from(document.links); // [node, node]
Array.from(document.querySelectorAll('a'))
// map
Array.from(document.links, (a) => a.href); // [href, href]
// arguments
var t = (...all) => Array.from(all);
t(1, 2, 3, 4, 5); // [1, 2, 3, 4, 5]
// array 没必要
Array.from([1, 2, 3]);
// set
var set = new Set();
set.add(1);
Array.from(set);
// map
var map = new Map;
map.set('a', 'A');
Array.from(map); // [ ['a', 'A'] ]
// object
Array.from({a: 'a'}); // []
Array.from({a: 'a', length: 1}); // []
Array.from({0: 'a'}); // []
Array.from({0: 'a', 10: 'A', length: 11}); // ['a', ......., 'A']


// 修正 new Array 不足
Array.of(1);
Array.of(-1);
Array.of('xxxx');
Array.of('a', 'b');


// 补充 indexOf 函数
var tmp = [1, 2, 3, null, NaN, true, false];
tmp.indexOf(NaN); // -1
// 找到返回索引;
// 反之, 返回 -1;
tmp.findIndex((value, index, array) => isNaN(value));

// 找到, 返回对应的值;
// 反之, 返回 undefined;
tmp.find((value) => isNaN(value));

// 可指定 this!
tmp.find(function(v) {
  return this.is(v);
}, {
  is: function(v) {
    return v === false;
  }
});

// 在箭头函数中, 这样使用 this 无效.
tmp.find((v) => {
  // 指向 window
  return this.is(v);
}, {
  is: function(v) {
    return v === false;
  }
});


// 填充值
new Array(10).fill(8);
new Array(10).fill(8, 0, 5);
new Array(10).fill(8, 5, -1);


// 数据操作多数使用前闭后开区间
[1, 2, 3, 4, 5].slice(1, 4); // [2, 3, 4]


// copyWithin: 复制 start, end 区间元素到 target 位置
// 复制 0、1 两个元素, 粘贴到 3、4 位置
[0, 1, 2, 3, 4, 5].copyWithin(3, 0, 2); // [0, 1, 2, 0, 1, 5]
// 同上, 但复制的元素个数多 1
[0, 1, 2, 3, 4, 5].copyWithin(3, 0, 3); // [0, 1, 2, 0, 1, 2]

// 从 0 开始粘贴, start/end 支持负值
[1, 2, 3, 4, 5].copyWithin(0, -2, -1);  // [4, 2, 3, 4, 5]

// target 同样支持负值
[0, 1, 2, 3, 4, 5].copyWithin(-1, 3);  // [3, 4, 5, 3, 4, 5]

// 当省略 end 参数时, 直到数组结束
[0, 1, 2, 3, 4, 5].copyWithin(0, 3);  // [3, 4, 5, 3, 4, 5]


for (let index of ['a', 'b'].keys()) {
  console.log(index); // 0, 1
}

for (let elem of ['a', 'b'].values()) {
  console.log(elem); // 'a', 'b'
}

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem); // 0, 'a';  1, 'b'
}
