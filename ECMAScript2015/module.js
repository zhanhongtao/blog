
// export.
export var name = 'tt';
export var age = 30;

// or
var name = 'tt';
var age = 30;
export {name, age};

// 输出函数
export function getAge(name) {
  if (name === 'tt') return age;
  return 0;
}

// 或者使用其它名称.
export {
  name as userName,
  age as userAge
};

export getAge as get;


// 引入整个模块.
module localname from './other-module-name.js';

// 相当于 commonjs 中:
var localname = require('./other-module-name.js');

// 引入模块的一部分.
import {a, b, c} from './other.js';
// 要求 other 模块 export 出 a, b, c 变量.

// 也可以改变变量名称.
import {a as state} from './other.js';

// 使用 import 引入整个模块.
// 同 module 命令
import * as localname from './other.js';


// 通过上面了解到, 如果想使用 import 就需要知道模块
// 抛出什么变量名称.



