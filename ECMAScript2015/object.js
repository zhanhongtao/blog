//  从 ES5 开始.

// Object 是顶层对象
Object.prototype // 来自 Function -> 即 Object 是函数实例.
// 可执行: new Object
var tmp = new Object;
// 非内部实例不存在 prototype
tmp.prototpye;

// 构造函数原型对象的 constructor 指向构造函数
Object.prototype.constructor === Object;

// 基于原型创建对象.
var test = Object.create(Array.prototype);
console.log(test);


var tmp = {};
// 定义属性
Object.defineProperty(tmp,
  // 属性名称
  'n',
  {
    // 属性描述
    configurable: true, // 属性的 Descriptor 是否可被重写
    enumerable: true, // 属性是否可被枚举 - for...in
    writable: true, // 属性是否可被重写
    value: 1
  }
);

// 取属性的描述信息
// value/writable/enumrable/configurable
Object.getOwnPropertyDescriptor(tmp, 'n');
/**
  {
    writable: true,
    enumerable: true,
    configurable: true,
    value: 1
  }
*/

// 复数形式
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
// a 属性是非 enumerable!
// 定义 enumerable 来修正 for..in 问题
for (var key in tmp) {
  console.log('key:', key, '; value:', tmp[key]);
}

// 描述信息只针对特定属性本身.
// 依然可添加新属性.
tmp.other = 'Other';
console.log(tmp);


// 可调用静态方法 .preventExtensions(obj) 来防止对象添加属性
// 仅防止扩展新属性, 不关心已有属性.
Object.preventExtensions(tmp);
tmp.other_agin = 'Again';
console.log('extension:', tmp);

var other = {'a': 'A'};
console.log('start:', other);
// 保护已有属性
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

// 以参数为原型, 生成对象.
// 以 obj 对象作为 prototype生成对象 _
var _ = Object.create(obj);
console.log(_, _.a, _.b, _.c, _.d);

// 取一个对象的原型对象
var ptt = Object.getPrototypeOf(_);
console.log(ptt === obj); // true

// 设置原型对象
Object.setPropertyOf()

// 两个对象是否严格相等
Object.is('a', 'b');
Object.is([], []); // false
var t = [];
Object.is(t, t); // true
Object.is(+0, -0); // false
Object.is(NaN, NaN); // true


// Object.assign
// only enumerable property
// 浅 copy
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
// 类似 python 里面的 set 写法
// 但真正表示 map, 即 python 中的 dict
// 简洁表示法
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


var key = '_local_name_'
var cart = {
  _wheels: 4,
  // 支持单独定义 get/set 方法
  get wheels () {
    return this._wheels
  },
  // 在使用 fn.name 取函数的名称时,
  // 会带上相应的 get/set 关键字.
  // name 补充:
  // 使用 bind 函数生成的函数, 取 name 时, 会返回 bound + 原函数名.
  // 构造函数创建的函数, 返回 anonymous
  // Symbol 做名字时, 返回 description || ''
  set wheels (value) {
    if (value < this._wheels) {
      throw new Error('hey, come back here!')
    }
    this._wheels = value
  },
  // 属性支持表达式
  ['__' + '{key}']: 1,
  [key]: 'cn'
}
// 属性表达式与简洁表达法不能同时使用.

// 听变化
Object.observe()
Object.unobserve()

// 扩展运算符 ...
