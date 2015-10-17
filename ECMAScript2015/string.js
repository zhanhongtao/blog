'use strict';

/*!
  // 解决单字符占用双字节空间问题.
  String.fromCodePoint()
  String.prototype.codePointAt()
  String.prototype.at()
  
  十六进制表示法所表示范围:
  \u0000 - \uffff
  当表示双字节字符时, 需要两个 \uxxxx; 来表示.
  Es6 添加 \u{xxxx} 表示法. ex: \u{20bb7}
  或者将码点放进 {} 当中即可.

  同时为了让正则表达式可直接匹配双字节字符.
  Es6 添加 u 模式.
  
  String.prototype.normalize()
    NFC(default)
    NFD
    NFKC
    NFKD
  为了表示语调和重音符号, Unicode 有两种方法.
    1. 直接提供. \u01D1.
    2. 两个字符拼接. \u004f\u030c.
  但在 JavaScript 中, 两种写法在比较时, 不相等.
  为了解决这个问题, 添加 .normalize 方法.
  
  字符串是否包含:
  String.prototype.startsWith
  String.prototype.endsWith
  String.prototype.includes
  
  重复.
  String.prototype.repeat
  
  正则表达式 y 模式
  y 把 lastIndex 当作开始位置, 并且匹配 ^.
  
  // Es7
  Regexp.escape()
  把正则表达式字符串转化为正则模式
  
  String.raw()
*/

// 字符串模板
// 支持插值 - 支持变量, 甚至表达式
var email =  `hi ${name}:
  hi....
  ${name.toUpperCase()}
`;

// ES6 Template
// 使用函数来完成语句嵌套
;(() => {
  'use strict';
  // 内置支持换行处理
  let itemTemplate = value => `<li>
    <span>${value}</span>
  </li>`;
  let template = (list) => `<ul>${list.reduce((ret, item) => ret += itemTemplate(item), '')}</ul>`;
  let list = [1, 2, 3, 4, 5, 6];
  let ret = template(list);
  console.log(ret);  
})();

// 功能同上.
// template 支持表达式;
// 使用表达式嵌套
;(() => {
  'use strict';
  let template = (list) => `<ul>
    ${list.reduce((tpl, item) => {
      return tpl += `<li>${item}</li>`;
    }, '')}
  </ul>`;
  
  let ret = template([1, 2, 3, 4, 5, 6]);
  console.log(ret);  
})();

/*
  说明:
  * `` 符号内的空白/缩进/换行等都会原样输出在生成的字符串中
  * 当输出 ` $ { } 系列字符时, 需要转义
  * 插值不存在时, 语法错误
  * 当插值不是字符串时, 强制转成字符串
  
  其它/Todo:
  * 当作模块引擎使用时, 需要处理 xss; 
  * 国际化处理  
*/

var obj = {
  name: 'tt',
  template: `${this.name}`, // undefined
  render: function() {
    console.log(this.name); // 'tt'
  }
};
obj.render();


// 使用 Tag 来扩展 Template.
;(() => {
  'use strict';
  function tag(string, ...list) {
    // console.log(string, list);
    return list.reduce((ret, item, index) => {
        return ret = string[index] + (item
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
        ) + ret;
    }, string[list.length]);
  }
  let name = 'redky';
  let message = '<script>alert(1)</script>';  
  // Tag - function!
  let t = tag `@${name}. Hi, ${message}.`;
  console.log(t);  
})();

// @todo: 动态 string.

// 内置的 template 把模板和变量都抽取好
// 可使用 JavaScript 任意扩展
// ex: [XRegExp](http://xregexp.com/)
// 需要额外添加语法


// 得到原始字符串
// 下面的 \ 字符不再是表示转义
String.raw`A \tagged \template`; // 'A \tagged \template'

// es6 更符合开发者思维
var es6 = String.raw`['"+-\\]`;
var reges6 = new RegExp(es6);
var es5 = '[\'"+-\\\\]';
var reges5 = new RegExp(es5);
console.log(reges6, reges5);


// 长字节字符表示方法
var string = '\u{20bb7}';
var string = 'x\uD83D\uDE80y'; // \uD83D\uDE80 表示一个字符(长字节);
string.length; // 4(es5)
[...string].length; // 3(es6)
// reverse
[...string].reverse().join('');


// 原型链上方法
var str = 'xyz';
var string = str.repeat(10);


// 支持从 index 开始或结束
var string = 'abc';
string.startsWith('a'); // true
string.startsWith('a', 1); // false
string.endsWith('a'); // false
string.endsWith('a', 1); // true
string.includes('a'); // true
string.includes('a', 1); // false

/*!
  参考:
  * http://www.2ality.com/2015/01/es6-strings.html
  * http://www.2ality.com/2015/07/regexp-es6.html
*/
