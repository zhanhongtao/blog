'use strict';

var list = [1, 2, 3, 4, 5];

// 支持 break/continue/return - 修正 forEach
// 仅仅遍历数组元素 - 修正 for/in 遍历属性
for (let [index, value] of list) {
  console.log(index, value);
}

// 不支持普通对象的迭代 - for/in 或者 Object.keys(object)
// 支持 Array/伪数组/Set/Map等

// 对象存在 Symbol.iterator 方法时, 就支持迭代.
// obj[Symbol.iterator]()

// Array.prototype[Symbol.iterator]


/*!
  参考:
  * http://www.2ality.com/2015/02/es6-iteration.html
*/
