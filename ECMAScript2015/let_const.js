// Es6.
'use strict';

// let/const
// let 只在代码块中生效
// 新增块状作用域 - 注意函数挂起问题 - 严格模式(推荐)
// class 同样也不会挂起
for (let i = 0; i < 10; ++i) {
  console.log(i);
}

if (1){
  // 不会再像 var 一样挂起.
  // 同样, typeof 不再是安全操作.
  typeof a; // 异常
  console.log(a);
  let a = 10;
  console.log(a);
}

;(function() {
  // 注意: 当前 Chrome 下. 只在严格模式下支持 let/const
  'use strict';
  var g = 'g';
  if (1) {
    // 在代码块中使用 let 声明时, 变量不会挂起.
    // 直接赋值或者使用时, 会抛出异常.
    // 无视全局变量的存在.
    // 也叫: 暂时性死区(temporal dead zone)
    // 下面代码异常.
    g = 'l';
    let g = 'local';
  }
})();

if(1) {
  let t = 10;
  // 块内不允许重复声明
  // let t = 20;
  if (1) {
    const x = 10;
    // const x = 20;
  }
}

if (1) {
  let foo = 'outer';
  function bar(func = x => foo) {
    let foo = 'inner';
    console.log(func()); // outer
  }
  bar();
  // -> (babel)
  var foo = 'outer';
  function bar() {
    var func = arguments[0] === undefined ? function (x) {
      return foo;
    } : arguments[0];
    return (function () {
      var foo = 'inner';
      console.log(func()); // outer
    })();
  }
  bar();
}

// 常量
// 不会挂起
const domain = 'sogou.com';
// domain = 'baidu.com';
// 当常量值是对象/数组时, 对象/数组是可写的.
// 但不能重写常量.

// 最后,
// let/const 声明的变量不属于全局对象的属性.

/*!
  参考:
  * http://www.2ality.com/2015/02/es6-scoping.html
*/
