'use strict';

// 解构
// 不完全解构
var _list = [1, 2, 3];
var [a] = _list;
var [a, b] = _list;
var [a, , c] = _list;
var [, b, c] = _list;
var [a, b, c] = _list;
var [a, b, c, d] = _list;

// 解构时, 支持默认值
var [x = true, y] = [, 1];

// 对 undefined 和 null 解构会报错
// 只要某种数据结构具有Iterator接口，都可以采用数组形式的解构赋值。


// 对象属性做变量
// 声明 x, y
var [x, y] = {x: 1, y: 2};
// 声明 a, b
var {x: a, y: b} = {x: 1, y: 2};

// 对象解构同样支持默认值,
// 使用默认值的条件是: 值完全等于 undefined.
var {x = 3} = {};


var x;
var [x] = [1];
var {x} = {x: 1};
// 下面语句会报错, 因为 {} 会被当做语法块解析.
// 因此相当于直接写
// = {x: 1};
// 所以报错.
// {x} = {x: 1};


// 字符串可以当作数组对待, 因此也可用来解构.
var [x, y, z] = 'xyz';
var {length: l} = 'abc';

// 参数解构 - 伪数组
function sum([x = 10, y]) {
  return x + y;
}
sum([1, 2]);

function dox({x = 10, y} = {}) {
  return [x, y];
}
dox({x: 1, y: 2});

// 解构中, 声明中不能出现();
// var [(b)] = [3]; // 报错
var b;
[(b)] = [3];  // 赋值语句. 非声明.


// 其它.
// 翻转
[x, y] = [y, x];
// 函数返回值 - 数组/对象
[x, y] = (()=>[1, 2])();

// 用来遍历
var map = new Map();
map.set('a', 'b');
for (let [k, v] of map) {
  console.log(k, v);
}


/*!
  参考:
  * http://www.2ality.com/2015/03/destructuring-algorithm.html
*/