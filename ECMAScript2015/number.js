'use strict';

// 支持使用二进制, 八进制和十六进制表示
// https://github.com/zhanhongtao/blog/issues/186
var [x, y] = [0b11, 0o11];

// 2
0b11;
0B11;
// 8
0o11;
0O11;
011;
// 16
0x11;
0X11;

// 新增加静态方法.
// 用来检查 Infinite 和 NaN 特殊值.
// Number.isFinite()
// Number.isNaN()
var is = Number.isNaN('a');
var is = Number.isNaN(NaN);

// 把 parseInt 和 parseFloat 移植到 Number 对象上.
// 目的是减少全局变量, 逐步模块化.


// 新增加静态方法.
// 用来判断是否为整数 3 === 3.0;
// Number.isInterger()

// JavaScript能够准确表示的整数范围在-2ˆ53 and 2ˆ53之间。
// ES6引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。
// Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。


// 扩展 Math 对象.
Math.trunc(1.5) // 1. 表示移除小数部分

// 用来判断正负数
Math.sign(8);   // +1;
Math.sign(-8);  // -1;
Math.sign(0);   // 0;
Math.sign(NaN); // NaN;


/*!
  参考: 
  * http://www.2ality.com/2015/04/numbers-math-es6.html
*/
