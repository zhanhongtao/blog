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
  // 相当于 ES5 中的 function Point.
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
// 可以认为修正 ES5 中, 构造函数依然可当作函数调用的问题
// 默认返回 this.
// 和 ES5 相同, 可手动指定返回其它对象.

// class 声明的类, 不能挂起.
// 新声明都不支持了 - let/const/class!

// class 支持表达式写法.
// 类名和 ES5 中的函数名一样, 只能内部使用.
// 可以写立即执行的 class.

// class 代码块内部只支持方法, 不支持属性.
// 内容定义的方法是不可枚举的 - un enumerable - 和 ES5 不同.

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
// 同时可在子类中使用 super.staticMethod() 方式调用

// new 关键字存在 target 属性.
// 当使用函数调用方式执行构造函数时, new.target 为 undefined.
// 这种方法可定位用户调用方式.



// 参考:
// http://www.2ality.com/2015/02/es6-classes-final.html
// https://github.com/GoogleChrome/samples/blob/gh-pages/classes-es6/index.html
