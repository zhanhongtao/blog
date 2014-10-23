// 授人以鱼不如授人以渔
// 插入数据结构和算法 - 基本功
// 调试方法/测试/性能 - *开发者工具*
// 编码规范 - 习惯
// 入门 + 中级 + 高级

HTML 标签

CSS
盒子模型/文档流/BFC/布局/选择器/优先级 - 理论
oocss/sass/grunt|glup - 科普
应用: 
-> web桌面背景(css3)
-> 各种layout
-> Media
-> 水平垂直居中
-> ...

{
  数据类型/类型转换
  操作符/表达式 +/?:/!/~~/==转换/===
  流程控制
  // 了解底层方法实现原理
  String/Array/Object/Date 
  应用：
  -> 原型链
  -> 排序算法/[].sort
  -> 二义性 - , [] () + / : {}
  -> 日历控件
  -> 内置函数实现
  -> 数据类型判定
  -> 实现each函数
  -> 数组去重
}

// 重点
// 'use strict'

函数
构造函数/原型继承/了解模块化开发
函数/方法/值和地址/实参和形参/arguments/数组/伪数组[转化]
变量/变量和函数的挂起/私有变量/闭包/作用域
context/this/call/apply/bind/return
递归调用/回调函数/匿名函数/自执行函数(name)
函数柯里化/函数节流/单例模式
函数 -> 对象 -> 静态属性和方法 -> self memorize
思想: 约定大于配置/性能优化 - 缓存
应用:
-> assert - 测试工具
-> jQuery 的无 new 实例化
-> 实现 extend 函数
-> 求数组的最大值和最小值
-> 形参的使用 - queue/async 函数
-> _

// 正则表达式和二进制 - 跨语言
RegExp -> 正则相关函数和应用
{
二进制/二进制操作/进制转换/color转换
应用:
-> 二进制相关算法
}

{
  Math.round/Math.floor/Math.ceil/Math.random/Math.abs
  JSON.stringify/JSON.parse - 注意参数
  eval/try..catch..finally - 细节
  应用: 
  -> 计算器小程序
  -> 抽奖算法(要求不重复)
}

// 理解 JS 单进程的工作方式
setTimeout/setInterval/requestAnimationFrame
应用: 
-> 扩展assert - 支持异步测试
-> 倒计时(要求在整点时通知)
-> slide自动切换
-> 面试题解析

// 浏览器环境下的 JavaScript
alert/confirm/prompt
location/history/navigator/screen
window[top/self/parent/iframe]
escape/[encodeURIComponent/democeURIComponent/encodeURL/decodeURI]
应用：
-> Query解析(Debug状态)
-> Router 实现
-> JavaScript 中的字符编码 - xss

// DOM - 重点
element/attribute/text/nodeType
Element 尺寸和位置信息
网页渲染过程 - 高性能动画(css3)
DOMContentLoaded
应用: 
-> 查找点击的li在ul中是第几个?
-> DOM Tree 的遍历(深度遍历和广度遍历)
-> 增删改查 - 删除所有的 div 标签
-> 优化选择框 - 全选/反选/shift辅助选择
-> 实现 .css 方法 - opacity/background-position/z-index/css3
-> 元素的规则运动动画
-> 滚动加载新内容 - 无限加载 - 性能
-> slideUp/slideDown/fadein/fadeout 效果
-> 缓存系统(.data)
-> 解析地址(string)各个部分
-> placeholder
-> 列表的斑马线效果 - 高亮鼠标所在行
-> 实现 stricy 效果
-> 图片惰性加载/读取图片的真实尺寸(naturalWidth/naturalHeight)
-> 判断元素是否在窗口内
-> 选项卡

// 表单
form

// 重点
event
冒泡/捕获/listen/notify/同步和异步/
思想: 
-> (before)start(after) -> progress -> end(done/fail) + complete(always)
-> 中介者模式/观察者模式
应用:
-> 捕获的实际应用
-> 底层 switchab 实现 - slide/tab

// 和后端交互 - UI和数据分离
http/ajax/upload(file)/jsonp/pingback原理/formData/URL
javascript:/mailto:/data:/ - 协议
应用：
-> 搜索建议效果
-> 文件拖拽上传
-> pingback组件

// 存储和缓存
session/cookie/sessionStorage/localStorage/userData/indexDB
CDN/appcache[manifest] - 科普

// 应用
颜色选择器
图片惰性加载(优点)
缓动函数系列 - 防止重复提交
Markdown 解析器
回调函数管理 - promise
chrome 插件开发

