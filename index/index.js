var about = {
  title: 'About',
  avatars: {
    src: './index/qrcode.png',
    width: '160px'
  },
  list: [
    {
      label: 'Name',
      value: 'Redky'
    },
    {
      label: 'E-mail',
      value: 'redky@qq.com',
      link: 'mailto:redky@qq.com'
    }
  ],
  label: [ '程序员', '前端工程师' ]
}

var blog = {
  address: 'https://github.com/zhanhongtao/blog/issues',
  labels: [ 'ALL', '数据结构/算法', '二进制', '语法', 'JavaScript', 'HTML', 'CSS', 'Node', 'XSS', 'Other', 'Todo' ],
  css: [
    { title: '单行居中，多行时居作对齐，最多显示三行, 多余三行时显示...', address: './fe/line.html' },
    { title: '[type="radio"]:checked', address: './fe/checked.html' },
    { title: 'Fixed 元素, 内容自适应且水平居中', address: './fe/message.html' },
    { title: '换行小技巧', address: './fe/linebreak.html' },
    { title: 'Filter', address: './fe/filter/' },
    { title: '分隔线样式', address: './fe/hr.html' },
    { title: '单行文字两端对齐', address: './fe/align.html' },
    { title: 'css 之 desktop', address: './desktop/' },
    { title: 'Selctor', address: './fe/selector/' },
    { title: '最小高度', address: './fe/sticky-link-bottom.html', description: 'vh + calc 版本' },
    { title: '兼容最小高度', address: './fe/sticky-like-bottom-compatible.html', description: 'html 100% 版本' },
    { title: 'Sticky', address: './fe/scroll/sticky.html' },
    { title: 'Style About Box', address: './fe/box-style.html' },
    { title: 'Border', address: './fe/border.html' },
    { title: 'Border-radius', address: './fe/border-radius.html' },
    { title: 'Box', address: './fe/box.html', description: '老版本 Flex 语法' },
    { title: 'Flex', address: './fe/flex/' },
    { title: 'CSS - linear-gradient', address: './fe/gradient.html', description: '线性渐变' },
    { title: 'CSS - radial-gradient', address: './fe/radial-gradient.html', description: '径向渐变' },
    { title: 'inner-radius', address: './fe/inner-radius.html' },
    { title: 'CSS layout', address: './layout/', description: 'Alt + Number 切换 css 文件' },
    { title: 'CSS - Animation', address: './fe/animation.html' },
    { title: 'overlay', address: './fe/overflow-overlay.html', description: '不占空间的滚动条(fixed)' },
    { title: 'CSS - Auto Transition', address: './fe/auto-transition.html', description: '自动 transition' }
  ],
  js: [
    { title: 'lazyloader', address: './fe/lazyloader/' },
    { title: 'Scroll loader...', address: './fe/loader/' },
    { title: '日历控件', address: './calendar/production/' },
    { title: '星座页面开发过程', address: './xingzuo/' },
    { title: '下载任务(DEMO)', address: './task/task.html' },
    { title: '按特定表头顺序生成表格', address: './fe/table/' },
    { title: 'Lottery', address: './lottery/', description: '抽奖小程序' },
    { title: '分页', address: './pagination/' },
    { title: 'async & order', address: './fe/sync/' },
    { title: '装饰器实例', address: './fe/ms/' },
    { title: '条件排序', address: './sort/special.html', description: '双指针问题' },
    { title: '图片固定尺寸效果', address: './fe/ypy.douban.html', description: '来自ypy.douban.com' },
    { title: 'Queue', address: './queue/', description: 'es3, Yield, Promise, CSS3, async/await' },
    { title: 'Scroll Loading..', address: './fe/scroll/' },
    { title: 'simple-slide', address: './simpleslide/', description: '支持 Touch 事件' },
    { title: 'expand-select', address: './expandselect/', description: 'shift 辅助选择' },
    { title: 'customEvent', address: './fe/customEvent.html', description: '自定义事件' }
  ],
  tools: [
    { title: 'FX.js', address: 'http://github.com/zhanhongtao/fx.js', description: '前端动画骨架' },
    { title: 'light.js', address: 'http://github.com/zhanhongtao/light.js', description: '轻量级消息通知系统' },
    { title: 'compare version', address: 'https://github.com/zhanhongtao/compareversion', description: '比较版本号' },
    { title: 'xss-tools', address: './slider/utils/' },
    { title: 'font-spider', address: './font/font-face.html', description: '使网页中应用中文字体成为可能' },
    { title: 'rt.js', address: 'https://github.com/zhanhongtao/rt.js', description: '基于 JavaScript 语法' },
    { title: 'jQuery.slide.js', address: 'http://github.com/zhanhongtao/jQuery.slide.js', description: '可定制化插件' }
  ],
  other: [
    { title: '有关 Referer[referrer]', address: './fe/referer.html' },
    { title: 'Sliders', address: './slider' },
    { title: 'JavaScript - Animation', address: './fe/animation-javascript.html', description: '需浏览器支持' },
    { title: 'Ajax', address: './fe/ajax.txt', description: '文档' },
    { title: 'Object - JavaScript', address: './fe/object.txt', description: 'Object 方法/属性文档' }
  ]
}

var config = {
  about: about,
  blog: blog
}

var wrap = document.getElementById('box')

for (var key in config) {
  if (config.hasOwnProperty(key)) {
    render(key, config[key])
  }
}

function render (key, data) {
  var tmpldom = document.getElementById('tmpl-' + key)
  var html = rt.render(tmpldom.innerHTML, data)
  wrap.innerHTML = wrap.innerHTML + html
}
