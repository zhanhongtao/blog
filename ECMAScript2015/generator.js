/*
  类似普通函数, 但函数名前加 *, 内部使用 yield 关键字.
  生成器函数, 在第一次调用时, 并不会执行, 返回指向内部状态的指针对象 - Iterator
*/

var arr = [1, [[2, 3], 4], [5, 6]];
var flat = function* (a){
  var length = a.length;
  for(var i =0;i<length;i++){
    var item = a[i];
    if (typeof item !== 'number'){
      // 在生成器里调用生成器时,
      // 需要向前加 yield *
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)){
  console.log(f);
}
// 1, 2, 3, 4, 5, 6

/*!
  参考:
  * http://www.2ality.com/2015/03/es6-generators.html
*/

