/*       变量       */

/*
1, 变量类型：
    JavaScript 是弱类型, 变量可存储任意类型, 并且运行期间类型可变;
    -> 变量可进行类型转换;
*/

/*
2, 变量声明：
*/
var i;
var index;

var i,
    index;

var i = 0,
    index = 2;
/*
    变量声明, 无初始值时, 值为 undefined;
    并且 var 声明的变量, 不能使用 delete 操作符删除;

    重复声明会产生覆盖, 不会造成错误;

    遗漏声明, 则会把变量隐式声明此变量, 并做为全局变量; [发生在赋值时](下节介绍)
*/

function f() {
    var a = b = 4;
}
f();
console.log(b); // 4
console.log(a); //


/*
3, 变量作用域：
    以函数划分；
    函数内部声明的变量, 只能运行的函数内部, 即局部变量; (闭包仍可引用);
    内部变量比全局变量优先级别高;
*/

var g = 'global';
function check() {
    var g = 'local';
    console.log(g); // local
}
check();

/* 变量尽可能都使用 var 声明 */

/* 没有块级作用域 */
if (false) {
    var test = 2;
    function t() {
        console.log('t function');
    }
}
t();    // 't function';
console.log(test); // undefined;
/*
例外:
firefox 会报错;
t is not defined;
test 值为 undefined;(末声明和赋值的变量都是 undefined)
*/


/* 变量声明会提前挂起 */
function f() {
    console.log(test); // undefined
    var test = 'test';
    console.log(test); // 'test'
}
// 转化为
function f() {
    var test;
    console.log(test); // 变量仅声明, 则初始化为 undefined
    test = 'test';
    console.log(test); // 变量已赋值, 'test'
}

/* 未定义变量和未赋值变量 */
console.log(t); // 直接使用变量 t;

// 注： 直接给变量赋值时, 会隐式的把变量做为全局对待;
var t; // 未赋值变量, undefined;


/*
4, 基本类型和引用类型：
    Number/boolean/null/undefined/ 基本类型;
    Array/Object/Function 引用类型

    第五版, 63页:
    无论将字符串看作是行为与基本类型相似的不可变引用类型,
    还是将它看作使用引用类型的内部功能实现的基本类型, 结果都是一样的;
    即： String 类型表现为 基本类型;

    下面实例说明基本类型和引用类型差别：
*/

var a = 3.14;
var b = a;
a = 4;
console.log(a, b); // 4, 3.14;


var a = [1, 2, 3];
var b = a;
a[0] = 99;
console.log(a, b); // 相同; [99, 2, 3];
// 数组是引用类型, 变量a和b 指向同一块内存地址;
// 变量保存基本类型的实际值, 而保存引用类型的引用(类指针);


/*
5, 垃圾收集

    引用类型是没有固定大小的, 比如: Array, 随时可以修改 length;
    变量并不能直接保存引用的值, 而是被存储在某个位置, 变量保存的只是对此位置的引用.
    所以, JavaScript 会动态分配内存来存储实体;
    最终要释放这些内存以便再用, 否则会消耗所有可用内存导致系统崩溃;

    JavaScript 不要求手动释放内存; 它使用一种称为垃圾收集方法[方法不可见];
    它会把对不再使用的对象所占用的内存释放;
*/
var s = 'hello';
var u = s.toUpperCase();
s = u; // 不能再获取到 'hello' 值;
// 环境中不再有 'hello' 引用[没有变量指向它]
// (是否进行回收, 是通过是否存在赋值决定的)

/*
6, 作为属性的变量

全局对象
window, this, Math;
浏览器中的：navigator, screen;
局部变量：调用对象

调用对象
全局变量是特殊的全局对象的属性, 那么局部变量被称为调用对象(call object)的属性;
函数的参数和局部变量作为调用对象的属性而存储;
(使用独立对象存储局部变量使 JavaScript 可防止局部变量覆盖同名全局变量的值)

JavaScript 的执行环境
JavaScript 解释器执行一个函数时, 会为函数创建一个执行环境(execution context);
一个执行环境就是所有 JavaScript 代码段执行时所在的环境.
运行不属性任何函数的 JavaScript 代码的环境使用的就是全局对象.

所有 JavaScript 函数都运行在 自己独有的执行环境中, 并且有自己的调用对象, 在调用对象中定义了局部变量.

JavaScript 解释器可在不同的全局执行环境中运行脚本, 并且这些环境不脱节, 彼此可引用;
(window-iframe);

深入理解变量作用域
每个 JavaScript 执行环境都有一个和它关联在一起的作用域链(scope chain);
作用域链是一个对象列表或对象链;
当 JavaScript 代码需要查询变量 X 的值时, 它就开始查看此链上的第一个对象;
如果对象存在一个名为 x 的属性, 那么就采用那个属性的值.
如果没有,  JavaScript 会继续查询链中的第二个对象.
如果还没有找到, 继续查询下一个对象. 以此类推...

*/

/* undefined / null */

/*
补充：

f() 作用域 -> 闭包作用域 -> var 变量所在作用域
-> Object 的原型作用域 -> Object 类属性作用域
-> 顶层作用域(window);

*/


/* 考察JavaScript的EOS（分号）问题，注意操作符是否存在 */
/* toString 存在一个参数[进制] */
function test() {
  try {
    return 1;
  } finally {
    return 2;
  }
}
alert(test());


// fileapi