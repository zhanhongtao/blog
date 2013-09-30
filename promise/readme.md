
## promise

```
function getHTML() {
  var defer = new Deferred();
  // var defer = Deferred();
  setTimeout(function() {
    defer.resolve( 'html' );
  }, 100);
  return defer.promise;
};

getHTML().done(function() {
  console.log( 'html' );
});
```

### api

#### deferred 实例
`var deferred = new Deferred;`
或
`var deferred = Deferred();`

##### 属性 - promise ( deferred.promise )
  promise 对象有下面方法:
  * then( done, fail, progress );
  * done( function )
  * fail( function )
  * progress( function )
  * always( function )
  * stat -> 返回状态. pending/resolved/rejected
  * isPromise -> boolean

##### 方法:
  * resolve
  * reject
  * notify
