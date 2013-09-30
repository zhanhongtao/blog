
## se 函数库

### 静态方法

#### noConflict


#### chain
为了方便扩展 se 对象而存在. 参考 http://underscorejs.org/
```
  se.mixin( arrayHelper );
  // arrayHelper 上的静态方法会写到
  // se.prototype 上.

  // arrayHelper 上存在 max 静态方法
  // value 为 se.prototype 上方法.
  se.chain( [1,2] ).max().value(); // 返回 2
```


#### type
返回数据类型
```
  se.type( 'string' ); // string
  se.type( null ); // null
```


#### toArray( array, index );

```
se.toArray( [1, 2, 3], 1 ); // [ 2, 3 ];`
// 实现方式:
return [].slice.call( array, index );
```


#### each
#### extend
#### bind
`Function.prototype.bind`
#### flat( array )
对数组处理.

```
  se.flat( [1,2,[3]] ); // [1,2,3]
  se.flat( [1,2[3,[4]]); // [1,2,3,4]
```


#### partial
#### once(func)
函数 func 仅执行一次.

```
var bindEvents = se.once(function() {
  console.log( 'bind Events' );
});
bindEvents();
bindEvents();
// 打印一次 bind Events
```


#### wrap( old_func, new_func )
面向切面.

```
var log = function() {};
log = se.wrap( log, function( next ) {
  console.log( 'before' );
  next();
  console.log( 'after' );
});
```

上例中, next 指向定义的 log 函数. 用户可指定 next 函数执行位置, 即 before/after 等支持异步函数.


#### debounce
#### throttle
#### se.after( count, callback )
执行 count 次后, 才真正执行 callback 函数.


#### queue
函数执行队列

```
se.queue( [1, 2], function( item, index, ret, next ) {
  next( item );
}, function() {
  console.log( 'done' );
});
```

串行执行数组元素.  
next 位置用户可指定, 即支持异步调用.  
语法 `se.queue( array, iterator, callback );`  

iterator 参数列表:
  * item 当前项
  * index 当前索引
  * ret 已处理过条目的返回值( array )
  * next 执行下一条, 并且返回当前结果. next( result )

@note:
1. item, index, ret 都是可选项.
2. callback 函数参数列表是 array 各项处理后的结果.


#### sync
并行执行. 同 queue 相对.

```
se.sync( [1,2,3], function( item, index, ret, done ) {
  done( item );
}, function() {
  console.log( 'done' );
});
```

语法:
`se.sync( array, iterator, callback, flag );`  
iterator/callback 和 queue 中的类似.  
flag boolean 类型.
  * true 表示处理完一项, 检测它前面的条目是否已处理完, 如果处理完, 直接调用 callback. 即 callback 有可能会调用多次.
  * false [ default ]. 同 queue 类似. 各项处理完后, 执行 callback.


#### create
#### delay
#### identify
#### memoize
#### mixin

### 原型方法
#### chain
#### value

