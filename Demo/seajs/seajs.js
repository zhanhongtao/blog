




Rules:

// define 中的匿名函数第一个参数必需是 require.
define(function (require) {
    // code goes here.
});

// 在任何作用域中, 不能重定义 require 方法, 或赋值给其它变量.

// require 参数必须是一个单独的字符串.
// ( 注： 不能是变量; 不能是使用 + 拼接的字符串; 不能使用字符串方法等; )


config:

seajs.config({
    base: 'http://path/to/libs/', // 下面在手动定义 base 路径时, 已经提到.
    alias: {
        'app': 'path/to/app/', // 定义花名.
        'jquery': 'jquery/1.6.2/jquery' //  var $ = require('jquery'); -> jquery/1.6.2/jquery
            // ( var biz = require('app/biz'); -> require('path/to/app/biz'); )
    },
    map: ['http://example.com/', 'http://localhost'],
    charset: 'utf-8', // <script charset="utf-8"></script>
    timeout: 20000, // 加载 JavaScript 文件超时时间.
    debug: 0 // true-> 显示 log, warning 和 Error 信息; false-> 显示错误. 2-> 向文件上添加时间戳, 防止文件缓存.
});


noConflict();
var myLoad = seajs.noConflict(); // 把 define 换成其它.
// http://seajs.com/docs/configuration.html
myLoad.use('./main');

// main.js
myLoad.define(function (require, exports, module) {
    // snip.
});


use:
// 使用 use 加载 JavaScript 文件.
seajs.use('path/to/init');
seajs.use('path/to/init', function (init) {
    // init -> var init = require('path/to/init');
});
// 如果不存在回调函数, 就更简单些.
<script src="sea.js" data-main="path/to/init"></script>
// 也可以同时引入多个模块.
seajs.use(['./a', './b'], function (a, b) {
    // a/b 分别指向模块.
});




define(function (require, exports, module) {

    // the module code goes here.
});

define(function (require, exports) {

    // snip...
    exports.foo = 'bar';
    exports.doSomething = function () {};
});

define(function (require, exports) {
    return {
        foo: 'bar',
        doSomething: function () {}
    };
});


define({
    foo: 'bar',
    doSomething: function () {}
});


// wrong.
define(function (require, exports) {
    exports = {
        foo: 'bar',
        doSomething: function () {}
    }
});
// Please use return or module.exports to expose the API in this case;


require.

define(function (require) {

    // 引入其它模块 api.
    var a = require('./a');
    a.doSomething();
});


require.async.

define(function (require, exports, module) {

    // load one module.
    require.async('./b', function (b) {
        b.doSomething();
    });

    // load multiple modules.
    require.async(['./c', './d'], function (c, d) {

        // do  something.
    });

});

require('http://example.com/js/a'); // -> http://example.com/js/a.js
require('/js/b'); // -> Root JavaScript. -> http://example.com/js/b.js
require('./b'); // -> http://example.com/js/b.js
    // (Relative to the containing file.)
require('jquery/1.6.2/jquery'); // -> http://example.com/libs/jquery/1.6.2/jquery.js
    // (不以 . 或 / 开头时, 会基于 base 路径.)
    // base path:
    // If the sea.js path is: http://example.com/js/libs/sea.js
    // then the base path is: http://example.com/js/libs/
    // And can config the base path manually:
    seajs.config({
        base: 'http://code.jquery.com'
    });
    require('jquery');
    // -> http://code.jquery.com/jquery.js

About File Extensions:
    require('http://example.com/js/a');
    require('http://example.com/js/a.js');
    // -> http://example.com/js/a.js
    // ( js 文件总是向后添加 js 后缀 )

    require('http://example.com/css/a.css');
    // -> http://example.com/css/a.css.
    // (css 文件总是需要加 .css)

    require('http://example.com/js/a.json?callback=define');
    // -> http://example.com/js/a.json?callback=define.
    // ( 如果存在 ? 号, 则不再追加后缀 ).

    require('http://example.com/js/a.json#');
    // -> http://example.com/js/a.json
    // ( 在结尾存在 hash 符号[#], 则会忽略 )

Require 支持连写..

module.
Contains metadata about the module.
module.id.

define(function (require, exports, module) {
    console.log(module.id); // http://path/to/this/file.js
    console.log(require(module.id) == exports); // true;
});

module.dependencies.


module.exports.

define(function (require, exports, module) {
    console.log(module.exports === exports); // true;
    module.exports = new SomeClass();
    console.log(module.exports === exports); // false;
});










