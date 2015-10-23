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
// 用来检查 finite 和 NaN 特殊值.
// 不进行类型转换 - 这点于 window.isNaN 和 window.isFinite 不同.
// Number.isNaN()
Number.isNaN('a'); // false
Number.isNaN(1); // false
Number.isNaN(isFinity); // false
Number.isNaN(NaN); // true
// Number.isFinite()
Number.isFinite(1); // true
Number.isFinite('a'); // false
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false

// 同时, ES6 逐渐把 js 模块化 - 把对应方法绑定到相应对象上, 以减少全局变量.
Number.parseInt('12'); // 12
Number.parseInt('12', 3); // 5;

// 新增加静态方法.
// 用来判断是否为整数.
// Number.isInterger()
Number.isInterger(0); // true;
Number.isInterger(-0); // true;
Number.isInterger(-1.1); // false;
Number.isInterger(1.1); // false;
Number.isInterger(1); // true
Number.isInterger(1.0); // true;
// 注: 3 === 3.0; 和整数和浮点数的存储方法有关.

// JavaScript能够准确表示的整数范围在-2ˆ53 and 2ˆ53之间。
// ES6引入了 Number.MAX_SAFE_INTEGER 和 Number.MIN_SAFE_INTEGER 这两个常量，用来表示这个范围的上下限。
Number.MIN_SAFE_INTEGER
Number.MAX_SAFE_INTEGER
// Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。

Number.EPSILON; // 极小值 - 作为误差最小接受范围(b - a <Number.EPSILON)

/*!
  参考:
  * http://www.2ality.com/2015/04/numbers-math-es6.html
*/
