Promise

Value - Status
* pending
* resolved
* rejected


Status immuteable
* pending
* resolved | rejected


Instance

```js
promise = new Promise(function(resolve, reject) {
  // update status.
  // current: pending.
  setTimeout(function() {
    Math.random() > 0.5 ? resolve(1) : reject(0);
  }, 0);
});
```

DEMO

```js
function fetch(url/*, cfg*/) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject('network-error');
    };
    xhr.ontimeout = function() {
      reject('timeout');
    };
    xhr.send(null);
  });
}
```


Method
promise.then(function() {

}, function() {

});
// 习惯写法
promise.then(function() {});

promise.catch(function() {

});
// eq:
promise.then(null, function() {});


Static Method
promise = Promise.all(array);
Promise = Promise.race(array);
promise = Promise.resolve(value);
promise = Promise.reject(value);


DEMO

```js
// 1.
var url = 'https://www.sogou.com/';
promise = fetch(url);
promise.then(function(t) {
  console.log(t);
}).catch(function(e) {
  console.log(e);
});
```


```js
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 2.
function async(min, max, t) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(random(min, max));
    }, t || 10);
  });
}

// 2.0
async(1, 10).then(function(x) {
  async(x, x + 10).then(function(y) {
    console.log('2.0:', y);
  });
});

// 2.1
async(1, 10).then(function(x){
  console.log('x:', x);
  return async(x, x + 10);
}).then(function(y) {
  console.log('2.1:', y);
})

// 2.2
Promise.all([
  async(1, 10),
  async(101, 200)
]).then(function(argus) {
  console.log('2.2:', argus, argus.reduce(function(ret, item) {
    return ret + item;
  }, 0));
});

// 2.3
Promise.race([
  async(1, 10, random(10, 100)),
  async(101, 200, random(10, 100))
]).then(function(z) {
  console.log('2.3:', z);
});

```


Order

```js
// 3.0
console.log('start!')

setTimeout(function() {
  console.log('setTimeout:10')
}, 10);

var p = new Promise(function(resolve, reject) {
  console.log('start - in promise');
  var i = 0, l = 1000;
  do {
    ++i;
  } while (i < l);
  resolve('promise-resolved');
  console.log('end - in promise');
});

p.then(function(text) {
  console.log('promise then:', text);
});

console.log('end!');

```

```js
// 3.1
var g = 0;
function t() {
  return new Promise(function(done, fail) {
    setTimeout(function() {
      done(++g);
    }, random(10, 100));
  });
}

var p = t();

p.then(function() {
  return t();
}).then(function(x) {
  console.log('a:', x)
});

p.then(function(x) {
  return x + 100;
}).then(function(x) {
  console.log('b:', x);
});

p.then(function(x) {
  console.log('c:', x);
});

```

```js
// 3.2
var g = 0;
var p = t();

p.then(function(x) {
  console.log(x);
});

p = p.then(function() {
  return t();
});

p.then(function(x) {
  console.log(x)
});

p.then(function(x) {
  console.log(x);
});

p = p.then(function() {
  return t();
}).then(function(x) {
  console.log(x);
});

p.then(function(x) {
  console.log('what?', x);
});
```

参考
* https://docs.google.com/presentation/d/1Gt9rYxmwdOsIu6lYgXLZeACNjMkxtqREAis4r-SoBzc/edit#slide=id.g48274ca9_05
* http://es6.ruanyifeng.com/#docs/promise
* https://vimeo.com/96425312
* https://github.com/zhanhongtao/blog/issues/68

// DEMO
// reduce.
[1, 2, 3, 4, 5].reduce(function(ret, current, index, array) {
  console.log(arguments);
  return ret + current;
}, 0);

