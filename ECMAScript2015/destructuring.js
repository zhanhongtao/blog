'use strict';

// 解构
// 不完全解构
// 类似模式匹配
var _list = [1, 2, 3];
var [a] = _list;
var [a, b] = _list;
var [a, , c] = _list;
var [, b, c] = _list;
var [a, b, c] = _list;
var [a, b, c, d] = _list;
var [a, ...all] = _list;

// 解构时, 支持默认值
// 判断规则是, 右侧元素 === undefined
var [x = true, y] = [, 1];

// 对 undefined 和 null 解构会报错
// 只要某种数据结构具有Iterator接口，都可以采用数组形式的解构赋值。ex: Set/Map/User-defined-db
// 因此右侧为原始类型(除字符串之外)时, 就会报错


// 支持嵌套析构
var [a, [b]] = [1, [2]];
// a = 1;
// b = 2;
// 当嵌套关系出错时, 直接报错.
// var [a, [[b]] = [1, [2]];
// 对象属性做变量
// 声明 x, y
var [x, y] = {x: 1, y: 2};
// 声明 a, b - 即, 变量名和属性值不同
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
// 析构可以用在表达式
// ({x} = {x: 1});


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
dox({x: 1});

// 对比下面函数
function doxex({x, y} = {x: 10, y: 10}) {
  return [x, y];
}
doxex({x: 1});
// 为 doxex 指定默认值.
// 而不是为 x, y 指定默认值.
// 解构中, *声明语句*中不能出现();
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

// 默认值为函数调用, 当不使用默认值时, 函数不会求值(即, 惰性的)

// 同样适用于 let/const 声明的变量/常量
/*!
  参考:
  * http://www.2ality.com/2015/03/destructuring-algorithm.html
*/