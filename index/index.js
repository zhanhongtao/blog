var about = {
  title: '关于我',
  avatars: {
    src: './index/avatars.jpg',
    width: '120px'
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
    },
    {
      label: 'Github',
      value: '@redky',
      link: 'http://github.com/zhanhongtao/'
    },
    {
      label: '公司',
      type: 'text',
      link: 'http://sogou.com/',
      value: 'sogou.com'
    }
  ],
  label: [ '程序员', '前端工程师' ]
};

var blog = {
  title: '博客',
  description: '记录工作生活的点点滴滴',
  address: 'https://github.com/zhanhongtao/blog/issues?state=open',
  labels: [ '算法', '二进制', '语法', 'JavaScript', 'HTML', 'CSS', 'Node', 'XSS', 'other' ],
  shares: [
    {title: 'xss-tools', address: './slider/utils/'},
    {title: 'font-spider', address: './font/font-face.html', description: '使网页中应用中文字体成为可能'},
    {title: 'Sliders', address: './slider' },
    {title: 'Lottery', address: './lottery/', description: '抽奖小程序' },
    {title: 'css 之 desktop', address: './desktop/'},
    {title: 'compare version', address: 'https://github.com/zhanhongtao/compareversion', description: '比较版本号'},
    {title: 'rt.js', address: 'https://github.com/zhanhongtao/rt.js', description: '基于 JavaScript 语法' },
    {title: 'jQuery.slide.js', address: 'http://github.com/zhanhongtao/jQuery.slide.js', description: '可定制化插件' },
    {title: 'FX.js', address: 'http://github.com/zhanhongtao/fx.js', description: '前端动画骨架' },
    {title: 'light.js', address: 'http://github.com/zhanhongtao/light.js', description: '轻量级消息通知系统' },
    {title: 'expand-select', address: './expandselect/', description: 'shift 辅助选择'}
  ],
  demos: [
    {title: '条件排序', address: './sort/special.html', description: '特殊条件下排序 - 双指针问题'},
    {title: '10 点提醒', address: './fe/reader/', description: '10点后必须提醒, 且提醒一次'},
    {title: '图片固定尺寸效果', address: './fe/ypy.douban.html', description: '来自 ypy.douban.com 首页 - 2015/06/08' },
    {title: 'Queue', address: './queue/', description: 'es3, Yield, Promise, CSS3' },
    {title: 'Selctor', address: './fe/selector/' },
    {title: '最小高度', address: './fe/sticky-link-bottom.html', description: 'vh + calc 版本'},
    {title: '兼容最小高度', address: './fe/sticky-like-bottom-compatible.html', description: 'html 100% 版本'},
    {title: 'Scroll Loading..', address: './fe/scroll/' },
    {title: 'Sticky', address: './fe/scroll/sticky.html'},
    {title: '遍历 DOM-Tree', address: './walkdomtree/'},
    {title: 'Style About Box', address: './fe/box-style.html'},
    {title: 'Border', address: './fe/border.html'},
    {title: 'Border-radius', address: './fe/border-radius.html'},
    {title: 'Box', address: './fe/box.html', description: '老版本 Flex 语法'},
    {title: 'Flex', address: './fe/flex/'},
    {title: 'CSS - linear-gradient', address: './fe/gradient.html', description: '线性渐变'},
    {title: 'CSS - radial-gradient', address: './fe/radial-gradient.html', description: '径向渐变'},
    {title: '内圆角', address: './fe/inner-radius.html'},
    {title: 'CSS layout', address: './layout/', description: 'Alt + Number 切换 css 文件)' },
    {title: 'CSS - Animation', address: './fe/animation.html' },
    {title: 'JavaScript - Animation', address: './fe/animation-javascript.html', description: '需要浏览器支持' },
    {title: 'CSS - Auto Transition', address: './fe/auto-transition.html', description: '自动 transition' },
    {title: 'simple-slide', address: './simpleslide/', description: '支持 Touch 事件' },
    {title: 'Ajax', address: './fe/ajax.txt', description: '文档' },
    {title: 'Object - JavaScript', address: './fe/object.txt', description: 'JavaScript 中 Object 方法/属性文档'},
    {title: 'overlay', address: './fe/overflow-overlay.html', description: '不占空间的滚动条(fixed)'}
  ]
};

var config = {
  about: about,
  blog: blog
};

var wrap = document.getElementById( 'box' );

for ( var key in config ) {
  if ( config.hasOwnProperty(key) ) {
    render( key, config[key] );
  }
}

function render( key, data ) {
  var tmpldom = document.getElementById( 'tmpl-' + key );
  var html = rt.render( tmpldom.innerHTML, data );
  wrap.innerHTML = wrap.innerHTML + html;
}
