
/*!
  语法结构
  var proxy = new Proxy(object, handler)

  object -> 被拦截对象
  handler -> 如何拦截, 以及拦截后如何处理

  对象操作要被拦截, 就得在 Proxy 实例上操作对象.

*/


/*
  handler:
  {
    // 写属性
    set: function(target, property, receiver) {
    }
    // 读属性
    get: function(target, property, value, receiver) {

    },
    // 函数调用
    // proxy(...arguments)
    // proxy.call()
    // proxy.apply()
    // type(target) -> function
    // content -> this
    apply: function(target, context, args) {

    },
    // 拦截实例化
    construct: function(target, argus) {

    },
    // in 操作
    // 返回 Boolean
    has: function(target, key) {

    },
    // 拦截 delete 操作
    deleteProperty: function(target, key) {

    },
    // 拦截 for in 操作
    // 返回迭代器
    enumerate: function(target) {

    },
    // 拦截 hasOwnProperty
    hasOwn: function(target, key) {

    },
    // 拦截:
    // Object.getOwnPropertyNames(proxy)
    // Object.getOwnPropertySymbols(proxy)
    // Object.keys(proxy)
    // 返回 array
    ownKeys: function(target) {

    },
    // 拦截 Object.getOwnPropertyDescriptor
    // 返回 object
    getOwnPropertyDesriptor: function(target, key) {

    },
    // 拦截 Object.defineProperty(proxy, property, description)
    defineProperty: function(target, key, desc) {

    },
    // 拦截 Object.preventExtensions(proxy)
    preventExtensions: function(target) {

    },
    // 拦截 Object.getPrototypeOf(pxory)
    getPrototypeOf: function(target) {

    },
    // 拦截 Object.isExtensible(proxy)
    isExtensible: function(target) {

    },
    // 拦截 Object.setPrototypeOf(proxy, proto)
    setPrototypeOf: function(target, proto) {

    },

  }

*/


/*

  let {proxy, revoke} = Proxy.revokeable(target, handler)
  // proxy -> 实例
  // revoke -> function -> revoke() 后, 实例不存在

*/


// Reflect 对象 
// 在使用代理时, 保留原始使用接口.

