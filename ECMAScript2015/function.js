'use strict';

// 函数参数默认值
// 当函数参数完全等于 undefined 时, 才会使用默认值.
/*!
  1. 当存在默认值时, 形式函数长度(func.length) 表示的是, 不存在默认值的参数个数.
  2. 默认值为函数时, 函数作用域的是当前函数作用域.
  3. 不能在函数内部再次使用 let/const 声明.
*/

// 可查看相关demo.
// http://github.com/GoogleChrome/samples

// 箭头函数.
// https://github.com/zhanhongtao/blog/issues/164

// 匿名函数
;(()=>{
  'use strict';
  let a = 'test';
  console.log(a);
})();

// 剩余参数
;(function() {
  'use strict';
  let f = (...x) => x.map(v => 2 * v);
  f(1, 2, 3); // [2, 4, 5]
})();

// DEMO
;(function() {
  'use strict';
  let contains = (list, ...items) => items.every(item => list.indexOf(item) > -1);
  // 不考虑 NaN 元素.
  let ret = contains([1, 2, 3, 4, 5], 1, 4, 5);
  console.log(ret);
})();

// ... 扩展运算符
// 该运算符将一个数组，变为参数序列
// Array.from
Math.max(...[14, 3, 77]);

// 扩展运算符运用.
;(function() {
  'use strict';
  let argus = [1, 2, 3, 4, 5];
  console.log(...argus);
});

;(function() {
  'use strict';
  function f(v, w, x, y, z) { }
  var args = [0, 1];
  f(-1, ...args, 2, ...[3]);
})();


// https://gist.github.com/Gozala/1697037
// 支持尾递归优化(tail call optimization (TCO))
// 函数结束位置 - return 语句.
// 可能存在尾递归的运算符:
// ?: - 三元运算符
// let a = x => x ? f() : g();
// f/g 位置都算尾位置.

// ||, && 
// let a = () => f() || g();
// let a = () => f() && g();
// f 不算尾位置; 而 g 算.
// 依赖 f 函数的返回值.

// , 逗号运算符
// let a = () => (f() , g());
// f 不算尾位置, 而 g 算.

// 参考: 
// http://www.2ality.com/2015/06/tail-call-optimization.html

