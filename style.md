# 前端编码规范

## 通用

* 文件保存时, 使用无 BOM 的 utf-8 编码
* 嵌套时, 应当使用空格(2个)代替 Tab 缩进
* 移除行尾空白字符
* 一行代码长度尽量保持80列左右
* 建议在部署代码前, 做代码合并压缩
* 添加文件描述, 文件描述写在首行

```js
/*
 * @description: 说明
 * @author: YourName@sogou-inc.com
 * @update: 2014-11-24
 */
```


## HTML

* 推荐使用 HTML5 标签
* 书写 doctype - `<!doctype html>`
* 使用 utf-8 做字符编码 - `<meta charset="utf-8">`
* 使用的标签(tag)尽可能符合语义
* 属性名 `class/id/data-...` 只使用小写字母, 单词之间使用 - 连字符; 不推荐驼峰命名
* 属性值使用双引号包裹 - `<img id="logo" src="//www.sogou.com/images/logo/new/sogou.png">`


## CSS

* 使用 link 标签(tag)引入 css 文件 - `<link href="./css/all.css">`
* 业务简单(单个活动页等)可写到 `<style>` 标签内; 不建议写行内样式
* 不使用 `@import` 引入文件
* 使用 utf-8 编码 - `@charset "utf-8";`
* Media Query 就近书写
* 属性选择器中的值必须用双引号包围
* 选择器的嵌套层级应不大于 3 级，位置靠后的限定条件应尽可能精确
* 空白
  * >、+、~ 选择器的两边各保留一个空格
  * 选择器和 { 之间保留一个空格
  * 属性值前要保留一个空格
  * } 单独占一行

```css
selector {
  color: #666;
}
```

* 多个选择器时, 每个选择器单独占一行

```css
.selector-before,
.selector-after {
  /* ... */
}
```

* 不忽略最后一条样式声明的分号

```css
selector {
  position: relative;
  overflow: hidden;
}
```

* 尽可能的使用简写形式

```css
selector {
  padding: 5px;
  margin: 0 auto;
  border: 1px solid #999;
}
```

* 不写前导零; 值为 0 时, 后面可以不写单位; (css3 部分属性在 firefox 下需要单位)

```css
selector {
  margin: 0;
  padding: 0;
  transform: all .5s ease;
}
```

* 背景图使用压缩工具压缩 - 配合设计师
* 对代码适当添加注释
* 禁止使用 Expression


## JavaScript

* 定义"常量"时, 变量名全部大写 `var DEFAULT_REQUEST_TIMEOUT = 5;`
* 需要提前声明变量, 防止产生全局变量

```js
var a, b, c;
// 或
var a;
var b;
var c;
```

* 语句行尾必须添加分号
* 空白

```js
// if
if (boolean) {

} else {

}

// for
for (var i = 0, l = list.length; i < l; ++i) {
  // code here...
}

// while
var l = list.length;
while (l--) {
  // code here...
}

switch (value) {
  case 1:
    break;
  case 2:
    break;
  default:
    break;
}
```

* 使用直接量

```js
var flag = false;
var array = [1, 2, 3, 4, 5];
var array = [
  'http://www.sogou.com/',
  'http://www.baidu.com/',
  'http://www.google.com/'
];
var object = {
  key: 'value'
};
```

* 使用 === 对操作数做比较
* 不建议使用 with/eval


# Code Review

1. 减少 bug 数量
2. 让每个人都读得懂

Code Review is about the code not about the coder!

建议积极参与.
