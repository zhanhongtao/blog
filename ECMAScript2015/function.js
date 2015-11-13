'use strict';

// 函数参数默认值 - 当函数参数严格等于 undefined 时, 才会使用.
/*!
  1. 当存在默认值时, 形式函数长度(func.length) 表示的是, 不存在默认值的参数个数.
  2. 默认值为函数时, 函数作用域的是当前函数作用域 - 即在函数定义时, 会被解析
  3. 不能在函数内部再次使用 let/const 声明.
*/

// 2015/11/13: 可在 firefox 下运行.
function dox(x = 1) {}
console.log(dox.length); // 0


// 可查看相关demo.
// http://github.com/GoogleChrome/samples

// 箭头函数.
// https://github.com/zhanhongtao/blog/issues/164

// 注意下面区别：
let test = {
  'do': () => this // undefined(严格模式)
};
test.do();

let test = {
  do() {
    console.log(this); // {}
  }
};
test.do();


// 匿名函数
// 箭头函数中, 没有参数或参数个数大于1时, 括号不能省略.
;(()=>{
  'use strict';
  let a = 'test';
  console.log(a);
})();

// 剩余参数
;(function() {
  'use strict';
  let f = (...x) => x.map(v => 2 * v);
  f(1, 2, 3); // [2, 4, 6]
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


// DEMO.
// http://perfectionkills.com/javascript-quiz-es6/
// 1.
(function(x, f = () => x) {
  var x;
  var y = x;
  x = 2;
  return [x, y, f()]; // [2, 1, 2]
})(1)

// 2.
(function() {
  return [
    (() => this.x).bind({ x: 'inner' })(),  // outer.  bind 对箭头函数无效
    (() => this.x)()                        // outer
  ]
}).call({ x: 'outer' });
// 使用箭头函数指定 this 后, 不能再改变
// 使用 call/apply/bind 都无效.

// 3.
let x, { x: y = 1 } = { x };
y;                                          // 1 默认值
/**
  let x;
  let {x: y = 1} = {x}
  // ->
  let {x: y = 1} = {x: x}
  // ->
  let {x: y = 1} = {x: undefined}
  // 当 value 为 undefined 时, 使用默认值
*/

// 4.
(function() {
  // 在严格模式下, this 为 undefined
  // let f = class h {}
  let f = this ? class g { } : class h { };
  return [
    typeof f, // function. ES6 中的 class 更像语法糖, 本质还是构造函数.
    typeof h  // undefined. 在表达式中使用类/函数时, 类/函数名称只能内部使用
  ];
})();

// 5.
(typeof (new (class { class () {} }))) // object.
/*!
  class {
    // 构造函数默认返回 this.
    class() {

    }
  }
  typeof new class;
  // ES5 中, 已允许关键字做属性.
*/

// 6.
typeof (new (class F extends (String, Array) { })).substring
/*!
  class F extends (String, Array) {

  }
  // ->
  class F extends Array {}

  let value = new F;
  typeof value.substring // undefined.
*/

// 7.
[...[...'...']].length
/**
  // 扩展运算符
  var a = [...'...']; // ['.', '.', '.']
  var b = [...a];     // ['.', '.', '.']
  b.length;           // 3
*/

// 8.
typeof (function* f() { yield f })().next().next()
/**
  function* f() {
    yield f
  }
  let g = f();
  g.next()
  // object...
  g.next() // Error
*/

// 9.
typeof (new class f() { [f]() { }, f: { } })[`${f}`]
/**
  t = new class f() { // 这里语法错误. class f {}
    [f]() {},
    f: {}
  }
  v = t[`${f}`]
  typeof v;
*/

// 10.
typeof `${{Object}}`.prototype  // 'undefined'
/**
  typeof `{Object}`.prototype;
  typeof '[object Object]'.prototype;
  typeof undefined; // 'undefined'
*/

// 11.
((...x, xs)=>x)(1,2,3) // Error
// ...x 表示剩余参数, 也就是说只能放在最后面

// 12.
let arr = [ ];
for (let { x = 2, y } of [{ x: 1 }, 2, { y }]) {
  arr.push(x, y);
}
arr;
// Error

// 13.
(function() {
  if (false) {
    let f = { g() => 1 };
  }
  return typeof f;
})()
// Error

// 14.
(function () {
  // this -> {x: 10}
  // arguments -> [20]
  // 箭头函数的 context 为 {x: 10}
  // 箭头函数内部不能再使用自身 arguments
  return (y) => console.log(this.x + arguments[0] + y);
}).call({x: 10}, 20)(30); // 60

// 参考:
// http://www.2ality.com/2015/06/tail-call-optimization.html
