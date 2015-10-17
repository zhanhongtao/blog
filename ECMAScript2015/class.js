'use strict';

// 支持关键字.
// Class, extends, super, static
// get, set

// 支持函数.
// constructor

// 使用 class 关键字
class Point {
  // 使用自定义 constructor 函数.
  // 当不存在 constructor 函数时, 默认会使用 `constructor() {}` 代替
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
 
  // 自定义原型方法
  toString() {
    return '(' + this.x + ',' + this.y + ')';
  }

  get area() {
      return this.x * this.y;
  }

  set x(x) {
    this.x = x;
  }
  
  static dox() {
    return 'do';
  }
}

// 使用 extends 关键字实现继承
class ColorPoint extends Point {
  // 如果 constructor 函数留空, 就必须手动调用下 super();
  // 或者直接不写 constructor 函数.
  constructor(x, y, color) {
    // 调用 Point 中的 constructor 函数
    super(x, y);
    this.color = color;
  }
  
  toString() {
    return super.toString() + ' in' + this.color;
  }
  
  // 定义 prototype 上的 dox.
  // 并且可使用 super 上的 static 方法 dox.
  dox() {
    return super.dox();
  }
  
}

// Test.
class RoundPoint extends Point() {
  
}

let cp = new ColorPoint(25, 8, 'green');
cp.toString();


// typeof Point -> function
// 但是不能再把 Point 当做函数使用了.
// 只能使用 new 关键字

// class 声明的类, 不能挂起.
// 新声明都不支持了 - let/const/class!

// class 支持表达式写法.
// 类名和 ES5 中的函数名一样, 只能内部使用.

// class 代码块内部只支持方法, 不支持属性.

// 静态方法和原型链方法
// 同时支持表达式做方法名.
// ex:
class Foo {
  ['my' + 'method']() {
    
  }
}

// 同样支持其它约定.
// ex: symbols 当做方法名.

// 支持 * 符号 - 迭代器方法

// 静态方法也会被继承.

// 参考: 
// http://www.2ality.com/2015/02/es6-classes-final.html
// https://github.com/GoogleChrome/samples/blob/gh-pages/classes-es6/index.html


