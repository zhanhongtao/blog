// 符号

Symbol();

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
var x = Symbol.for('x-global');
console.log(typeof x);

var symbolKey = Symbol.keyFor(x);
console.log('key:', symbolKey);


