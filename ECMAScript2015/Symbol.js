// 符号 - 新数据类型
// 生成唯一符号 - 从根本上解决属性名冲突问题
Symbol();

// 不能使用 new 来实例化
// 否则抛出异常
var a = Symbol('a');
var x = Symbol('x');
var y = Symbol('x');

console.assert(x != y); // true


typeof Symbol; // function
// 但是不能使用 new 关键字.
try {
  new Symbol();
} catch(e) {
  // 异常
  console.log(e);
}

var sym = Symbol('f');
typeof sym; // 'symbol'

// 几种使用方法:
// 1.
var object = {};
object[sym] = 1;

// 2.
var object = {
  [sym]: 1
};

// 3.
var object = {};
Object.defineProperty(object, sym, {
  value: 1
})

// 在 for..in 和 for .. of 中, 符号类型属性不会被迭代
// Object.keys()/Object.getOwnPropertyNames() 也不会返回符号属性
// 可使用 Object.getOwnPropertySymbols() 方法返回 - array


// 支持类型转换
var symObj = Object(sym);
typeof symObj; // 'object'
// 转换为字符串
String(Symbol('tt')); // 'Symbol(tt)'

// 也可使用 .for 方法来指定描述
var s = Symbol.for('a');
var x = Symbol.for('a');
s === x; // true

// search and return!
// 取全局符号里面找 'x-global', 如果存在就返回; 否则, 创建一个新符号;
var x = Symbol.for('x-global');
console.log(typeof x);

// 取符号对应的 key -> 可能不存在.
var symbolKey = Symbol.keyFor(x);
console.log('key:', symbolKey); // '-x-global'


// ES6 语言内置 Symbol 值 - 内部使用.
/*

  * Symbol.hasInstance
    对象使用 instanceof 运算符时, 会调用此方法.
    ex:
    foo instanceof Foo // ->
    Foo[Symbol.hasInstance](foo)
    ex:
    class Myclass {
      [Symbol.hasInstance](foo){
        return foo instanceof Array;
      }
    }
    var m = new Myclass;
    m instanceof Myclass; // false
  * Symbol.isConcatSpreadable
    表示对象使用 Array.prototype.concat 时, 是否展开.
    属性等于 boolean 值.
    ex:
    var values = [1, 2, 3];
    ['a', 'b', 'c'].concat(values); // ['a', 'b', 'c', 1, 2, 3]
    ex:
    var values = [1, 2, 3];
    values[Symbol.isConcatSpreadable] = false;
    ['a', 'b', 'c'].concat(values); // ['a', 'b', 'c', [1, 2, 3]]
  * Symbol.species
    构造函数实例化时被调用
  * Symbol.match
    当执行 string.match(regexp) 时, 属性会被调用
    ex:
    class M {
      [Symbol.match](string) {
        return `hello world`.indexOf(string);
      }
    }
    'e'.match(new M); // 1
  * Symbol.replace
  * Symbol.search
  * Symbol.split
  * Symbol.iterator
  * Symbol.toPrimitive
  * Symbol.toStringTag
  * Symbol.unscopables

*/