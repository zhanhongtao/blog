function wrap(...middlewares) {
  return fn => middlewares.reduceRight((fn, middleware) => {
    return middleware(fn);
  }, fn);
}

function timeout(n) {
  return function(f) {
    return function(...st) {
      return setTimeout(function() {
        f(...st);
      }, n);
    }
  }
}

function intercept(test) {
  return function(f) {
    return function(...argus) {
      if (test(...argus)) {
        return f(...argus);
      }
    }
  }
}

function mst(done, fail) {
  return function(n) {
    var last;
    var lt;
    var timer;
    var ret = {st: 0};
    return function(st) {
      var time = Date.now();
      if (!last) last = st;
      if (timer && last !== st && time - lt < n) {
        clearTimeout(timer);
      } else {
        timer = setTimeout(function() {
          ret.st = last;
          last == 1 ? done(ret) : fail(ret);
          last = null;
          timer = null;
        }, n);
      }
      last = st;
      lt = time;
    };
  };
}

var node = document.querySelector('#demo');
var classname = 'active';

function show() {
  node.classList.add(classname);
}

function hide() {
  node.classList.remove(classname);
}

var fshow = wrap(
  timeout(0),
  intercept(function(info) {
    return info.st === 1;
  })
)(show);

var fhide = wrap(
  timeout(4 * 1000),
  intercept(function(info) {
    return info.st === 0;
  })
)(hide);

var handle = mst(fshow, fhide)(250);

node.addEventListener('mouseenter', function() {
  handle(1);
}, false);

node.addEventListener('mouseleave', function() {
  handle(0);
}, false);
