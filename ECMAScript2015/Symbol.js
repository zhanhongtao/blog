// 符号 - 新数据类型
// 生成唯一符号.
Symbol();

// 不能使用 new 来实例化
// 否则抛出异常
var a = Symbol('a');
var x = Symbol('x');
var y = Symbol('x');

console.assert(x !== y);

try {
  new Symbol();
} catch(e) {
  // 异常
  console.log(e);
}

var sym = Symbol('f');
typeof sym; // 'symbol'

var symObj = Object(sym);
typeof symObj; // 'object'

// search and return!
// 取全局符号里面找 'x-global', 如果存在就返回; 否则, 创建一个新符号;
var x = Symbol.for('x-global');
console.log(typeof x);

// 取符号对应的 key -> 可能不存在.
var symbolKey = Symbol.keyFor(x);
console.log('key:', symbolKey);
