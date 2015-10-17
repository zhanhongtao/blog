//  从 ES5 开始.

Object.prototype.prototype == null;

var tmp = new Object;
tmp.prototpye == null;

Object.prototype.constructor === Object;

// 使用原型创建对象.
var test = Object.create(Array.prototype);
console.log(test);

var tmp = {};
// 定义属性
Object.defineProperty(tmp,
  // 属性名称
  'n',
  {
    // 属性描述
    writable: true, // 属性是否可被重写
    enumerable: true, // 属性是否可被枚举 - for...in
    configurable: true, // 属性的 Descriptor 是否可被重写
    value: 1
  }
);

// 取属性的描述信息
Object.getOwnPropertyDescriptor(tmp, 'n');
/**
  {
    writable: true,
    enumerable: true,
    configurable: true,
    value: 1
  }
*/

Object.defineProperties(tmp, {
  'a': {
    writable: false,
    enumerable: false,
    configurable: false,
    value: 'A'
  },
  'b': {
    writable: false,
    enumerable: true,
    configurable: false,
    value: 'B'
  }
});

// 打印出 n, b
// a 属性是不能 enumerable!
for (var key in tmp) {
  console.log('key:', key, '; value:', tmp[key]);
}

// writable 为 false 时, 属性的值不能被重写
// 但对象依然可以添加属性
tmp.other = 'Other';
console.log(tmp);

// 防止对象添加属性
Object.preventExtensions(tmp);
tmp.other_agin = 'Again';
console.log('extension:', tmp);

var other = {'a': 'A'};
console.log('start:', other);
Object.seal(other);
other.a = 'a';
// 防止对象扩展
// 并保护已存在属性(不能被删除)
other.b = 'b';
for (var key in other) {
  console.log(key, other[key]);
}
// 不能被删除.
delete other.a;
console.log('progress:', other);

// 冻结
// 不能再修改 value.
Object.freeze(other);
other.c = 'c';
other.a = 'A';
console.log('end:', other);

/*
  Object.isExtensible(object);
  Object.isSealed(object);
  Object.isFrozen(object);
*/

var obj = {
  a: 'a',
  b: 'b',
  c: 'c'
};
Object.defineProperty(obj, 'd', {
  enumerable: false,
  value: 'd'
});
// Object.keys() 只能拿到可枚举属性
var keys = Object.keys(obj);
console.log('Object.keys():', keys);

// 取对象的所有属性
var properties = Object.getOwnPropertyNames(obj);
console.log('properties:', properties); // ['a', 'b', 'c', 'd']

// 判断属性是否可枚举
obj.propertyIsEnumerable('a'); // true
obj.propertyIsEnumerable('d'); // false

// 生成 _ 对象, 并且以 obj 对象作为 prototype.
var _ = Object.create(obj);
console.log(_, _.a, _.b, _.c, _.d);

// 取一个对象的原型对象
var ptt = Object.getPrototypeOf(_);
console.log(ptt === obj); // true

// 两个对象是否相等
Object.is('a', 'b');
Object.is([], []);
var t = [];
Object.is(t, t);

// Object.assign
// only enumerable property
;(()=>{
  'use strict';
  let def = {a: 'default'};
  // clone
  let a = Object.assign({}, def);
  console.log(a);

  // merge
  a = Object.assign({}, {a: 1}, {b: 2});
  console.log(a);

  // no deep clone/merge!
  let b = Object.assign({a: 1, b: 3, c: {
    a: 1,
    b: 2
  }}, a, {c: {
    c: 3
  }});
  console.log(b);
})();

;(function() {
'use strict';

// key == value
var a = 'a', b = 'b', c = 'c';
var es6 = {a, b, c};
console.log(es6);

// 可以省略 function 关键字
var tmp = {
  name: '1',
  get() {
    return this.name;
  }
};

var t = tmp.get();
console.log('t:', t);

})();

