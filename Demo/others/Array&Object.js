






/*
   对象和数组 【JavaScript 权威指南 第五版】
*/






/*
对象： 是一个无序属性集合, 每个属性都有自己的名字和值 */

/* 创建对象简单方法, 对象直接量 */
var obj = {};
var obj = {name: 'maxthon'};
var obj = {name: {}, text: []};

/* 可使用 new 操作符 */
var a = new Array();
var d = new Date();
var r = new RegExp('javascript', 'i');
var o = new Object(); // var o = {};
/*
 注： new 操作符后跟构造函数,
    typeof Array;  // 'function'
    typeof Object; // 'function'
    Object 是 Function 的实例.
    Function 是特殊的对象, 也是 Object 的实例.
*/






/* 对象属性 */
// 使用 . 符合来存取属性的值.
// 注：同时可使用 [], 里面使用属性名(可使用变量, 这点特别有用).
var t = {};
t.text = 'hello';
t.n = [];
t.o = {};
t.o.name = 'rd';
t['n']; // []


var t = {"text": "hello"};
console.log(t.text); // 'hello';
// 补充： 通常使用关键字 var 来声明变量, 但是声明对象属性时, 不能使用 var 声明






/* 对象枚举 */

var F = function () {};
F.prototype.name = 'RD';
var obj = new F;
for (var key in obj) {
    console.log(key); // name;
}

// 仅枚举对象自身, 不沿原型链向上查
for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key); //
    }
}
/* 注： for in 不能枚举出预定义属性; toString. */







/* 检查属性存在性 */

window.a = 'rd';
console.log(a in window); // true;

var F = function () {};
F.prototype.name = 'RD';
var obj = new F;
console.log('name' in obj); // true;




/* 删除属性 */
delete obj.name;
// 补充: 使用 delete 操作符, 不能删除使用 var 声明的变量;





/* 作为关联数组的对象 */

// 取对象属性：
obj.name;
obj['name']; // 这里 name 为字符串.

// 使用 [] 表示时, 属性名是用字符串来表示的. 那么可
// 在运行过程中进行添加等操作
// 注：当此属性是做为变量传递时, 特别有用.
// 又称 关联数组



/* 映射： JavaScript 对象把字符串(属性名) 映射成值. */
for (var key in obj) {
    console.log(key); // key 属性名, 此处 做为值存在.
}


/*
    Object 通用属性和方法
    JavaScript 中所有对象都继承自 Object 类;

    1, constructor 属性.
    指向其构造函数.
*/
var F = function () {};
var f = new F;
console.log(f.constructor == F); // true

// 构造函数的原型存在属性 constructor 指向自己;
F.prototype.constructor == F;

// 补充：
var F = function () {};
var G = function () {};
G.prototype = new F;
var g = new G;
console.log(g.constructor == F); // true;
console.log(g.constructor == G); // false;


/*
  2, toString() 方法
*/
{'name': 'maxthon'}.toString(); // '[object Object]'

/* 数组使用 toString 方法, 把会元素组成字符串, 其它对象会转化为 [object Object];
函数使用原始 toString 方法, 会得到函数源码 */
['a', 'b', 1, false, ['e','f'], {}].toString();
// "a,b,1,false,e,f,[object Object]"

function t() {
    console.log('test');
}
t.toString();
// 源码

/*
    3, toLocaleString(); [不清楚]
        toLocaleDateString.
        返回对象的一个本地化字符串
    4, valueOf();
        在转化为基本类型时, 会使用到. valueOf/toString.
    5, hasOwnProperty();
    6, propertyIsEnumberable();
        是否可枚举出来;
    7, isPrototypeOf();
        a.isPrototypeOf(b);
        如果 a 是 b 的原型, 则返回 true;
*/
var o = {}; // new Object;
Object.prototype.isPrototyeOf(o);        // true;
Object.isPrototyeOf(o);                  // false;
o.isPrototyeOf(Object.prototype);        // false;
Function.prototype.isPrototyeOf(Object); // true;





/*
    数组: 有序的、值的集合;

    每个值, 也叫元素, 对应一个下标;
    下标是从 0 开始;
    数组中值, 可以为任何类型. 数组, 对象, null, undefined.
*/



// 创建.
var arr = [];
var arr = new Array();

var t = '';
var arr = [1,2,3, null, undefined, [], {}, t];

/* 使用 new 操作符创建数组的3种情况: */
var arr = new Array();       // [], 和直接量类似. 直接量会更快

var arr = new Array(5);      //  长度为 5; []直接量是无法做到的.
console.log(arr);            // []; JavaScript 引擎会无视 undefined;

var arr = new Array('5');    // 值为 ['5'];
var arr = new Array('test'); // 值为 ['test'];

/* 相关实例 */
var s = [1, 2, 3];
s[5] = 'a';
console.log(s); // [1, 2, 3, undefined, undefined, 'a']


/* 数组的读和写 */

value = array[0];
a[1] = 3.14;
i = 2;
a[i] = 3;
a[a[i]] = a[0];

// 数组 -> 对象 -> 属性
array.test = 'rd';

// 数组下标大于等于 0, 并且小于 2的32次方 减 1 的整数.
// 其它值, JavaScript 会转化成字符串, 做为对象属性的名字, 不再是下标.


var array = [];
array[9] = 10; // array 长度会变成 10;
// 注： JavaScript 解释器只给数组下标为 9 的元素分配内存, 其它下标无.

var array = [];
array.length = 10; // 添加 array 的长度;
array[array.length] = 4;


/* 删除数组元素 */
// delete 运算符把一个数组元素设置为 undefined 值, 但是元素本身还是存在的.
// 真正删除, 可以使用: Array.shift();【删除第一个】 Array.pop();【删除最后一个】 Array.splice();【从一个数组中删除一个连续范围】  或修正 Array.length 长度;

/* 相关实例 */
var a = [1, 2, 3];
delete a[1];
console.log(a); // [1, undefined, 3];

/*
补充： JavaScript 权威指南 第五版 59页
由 var 声明的变量是永久性的,  也就是说, 用 delete 运算符来删除这些变量将会引发错误.
但： 在开发者工具里面, 是可以删除的. 而在网页中, 正如书上所写.
*/


/* 数组长度 */
[].length;


/* 遍历数组 */
var array = [1, 2, 3, 4, 5];
for (var i = 0, l = array.length; i < l; i++) {
    console.log(array[i]);
}

array.forEach(function (item, index, arr) {
    console.log(item);
});

/* 截取或增长数组: 修正 length 长度, 前面已提过 */

/* 多维数组 */
[[1], [2]]

/* 数组方法 */
// join
var array = [1, 2, 3, 4, 5];
var str = array.join(); // 1,2,3,4,5
var str = array.join('-'); // 1-2-3-4-5
// 注： 此方法与 String.split() 方法相反;

// reverse();
var array = [1, 2, 3, 4, 5];
array.reverse(); // [5, 4, 3, 2, 1]
// 注：修改原数组;

// sort();
var array = [1, 3, 2, 4, 5, 3];
array.sort();// [1, 2, 3, 3, 4, 5];
/* 注： 数组中存在未定义元素, 把这些元素放到最后 */

/* 同时可自定义排序, sort(func);
func 接收两个参数,  如果第一个参数应该位于第二个参数之前, 那么比较函数将返回一个小于0的数, 相反, 返回大于0的数. 相等, 返回0;
*/
array.sort(function (a, b) {
    return b - a;
});

// 实例： 按奇数到偶数, 并且从小到大排序
[1, 2, 3, 4, 5, 6, 7, 2, 4, 5, 1].sort(function (a, b) {
    if ( (a & 1) && (b & 1) ) {
        return a - b;
    }

    if (a & 1) {
        return -1;
    }

    if (b & 1) {
        return 1;
    }

    return a - b;

});


// concat() 方法. 合并数组, 但不深度合并
var a = [1, 2, 3];
a.concat(4, 5); // [1, 2, 3, 4, 5]
a.concat([4, 5]); // [1, 2, 3, 4, 5]
a.concat([4, 5], [8, 9]); // [1, 2, 3, 4, 5, 8, 9]
a.concat([4, 5], [6, [10, 19]]); // [1, 2, 3, 4, 5, 6, [10, 19] ]


// slice() 方法. 数组不改变.
var a = [1, 2, 3, 4, 5];
a.slice(0, 3); // [1, 2, 3]
a.slice(3); // [4, 5];
a.slice(1, -1); // [2, 3, 4]
    a.slice(1, -1 + 5)
        a.slice(1, 4);
a.slice(-3, -2); // [3]
    a.slice(-3 + 5, -2 + 5);
        a.slice(2, 3);
/* 注：
    不包括第二个参数指定的元素.
    负值转化为: 负值 + 数组长度
*/

// splice(pos[, len[, a, b]]) 方法. 删除指定位置开始后, 指定长度元素, 再缀加元素;
// 返回删除元素组成的数组. 原数组改变.
var a = [1, 2, 3, 4, 5, 6, 7, 8];
a.splice(4); // [5, 6, 7, 8]; 此时 a: [1, 2, 3, 4]
a.splice(1, 2); // [2, 3]; 此时 a: [1, 4];
a.splice(1, 1); // [4]; 此时 a: [1];

var a = [1, 2, 3, 4, 5];
a.splice(2, 0, 'a', 'b'); // [1, 2, 'a', 'b', 3, 4, 5]
a.splice(2, 2, [1, 2], 3); // ['a', 'b']; 此时 a: [1, 2, [1, 2], 3, 3, 4, 5]
/* 注：
    第二个参数后的参数, 直接插入到处理数组中。
    第一个参数可为负数.
*/


// push() 方法和pop() 方法.
// push() 可以将一个或多个新元素附加到数组的尾部, 然后返回数组新长度;
// pop() 删除数组中的最后一个元素, 减少数组的长度, 返回它删除的值.
// 注：两个方法都在原数组上修改, 而非生成一个修改过的数组副本.

var stack = [];
stack.push(1, 2);   // stack: [1, 2];    return 2;
stack.pop();        // stack: [1];       return 2; 删除的元素值
stack.push(3);      // stack: [1, 3];    return 2;
stack.pop();        // stack: [1];       return 3; 删除的元素值
stack.push([4, 5]); // stack: [1, [4, 5]]returm 2;
stack.pop();        // stack: [1];       return [4, 5]; 删除的元素值

// unshift() 方法和 shift() 方法. 同上, 从数组头开始.


// toString() 方法和 toLocalString()
[1, 2, 4].toString(); // 1,2,3;
['a', 'b', 'c'].toString(); // 'a,b,c';
// 和无参数的 join 方法相同.


/* jsapi 新添方法：map, every, some, filter, forEach, indexOf, lastIndexOf, isArray */


/* 类似数组的对象 */

arguments
document.getElementsByTagName();




