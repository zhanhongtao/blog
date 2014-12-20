PPT 功能说明.

* @todo: 切换 PPT 和普通文档显示
* 切换 PPT 页面
  1. 左箭头/PageUp 切换到上一页
  2. 右箭头/PageDown 切换到下一页
  3. Home 键切换到首页
  4. End 键切换到最后一页
  5. CTRL + G 切换到指定页面
  5. 在 URL 地址中添加 nav=show 显示上/下页
  6. 内容在可编辑区域时, 使用 ALT 键强制切换页面
  7. CTRL + R - 支持循环显示
  8. @todo: 支持自动切换 PPT - 自定义切换时间
* 切换 PPT 页时, 自动抽取标题
  1. 优先提取 H1 内容
  2. 再尝试提取 PPT 块的[data-title]属性值
* 支持使用子 PPT 内容
  1. 添加 .sub-slide (className) 即可
* 临时隐藏 PPT 中内容
  1. 添加 .toggle 实现
  2. 在 URL 中加 v=1 显示
* 给 PPT 页面定义名称
  * PPT 页面添加 id 属性
  * 切换时, 会把 id 值添加到 URL Hash 中
  * 可直接在 URL 中更新 hash 来调转到指定页面
  * 支持 CTRL + G 切换到指定 PPT 页 - 输入 pageNumber 或者 ID
* 支持定义 PPT 背景
  * data-color
  * data-image
  * data-repeat
  * data-position
  * data-size
* 支持代码
  * 语法高亮
  * 运行代码
  * 自动运行代码
  语法说明:
    1. 代码使用 pre 标签包裹
    2. 给 pre 标签添加 .code 类名
    3. 自定义属性 data-
      * data-type 语法高亮时, 指定语言
      * data-run 代码是否支持运行
      * data-autorun 代码是否自动运行      
  ```
  <pre class="code" data-type="js" data-run="1" data-autorun="1">
   // Your Code Here!
  </pre>
  ```
