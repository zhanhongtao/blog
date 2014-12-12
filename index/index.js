var about = {
  title: '关于我',
  list: [
    {
      label: '网名',
      value: 'Redky'
    },
    { 
      label: 'E-mail',
      value: 'redky@qq.com',
      link: 'mailto:redky@qq.com'
    },
    { 
      label: 'Github',
      value: 'http://github.com/zhanhongtao/',
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
    {title: 'Lottery', address: './lottery/', description: '抽奖小程序' },
    {title: 'expand-select', address: './expandselect/', description: 'shift 辅助选择'},
    {title: 'css 之 desktop', address: './desktop/'},
    {title: 'Ajax', address: './fe/ajax.txt', description: '文档' },
    {title: 'rt.js', address: 'https://github.com/zhanhongtao/rt.js', description: '基于 JavaScript 语法' },
    {title: 'jQuery.slide.js', address: 'http://github.com/zhanhongtao/jQuery.slide.js', description: '可定制化插件' },
    {title: 'PPT', address: './ppt' }
  ],
  demos: [
    {title: 'Selctor', address: './fe/selector/' },
    {title: '最小高度', address: './fe/sticky-link-bottom.html', description: 'vh + calc 版本'}, 
    {title: '兼容最小高度', address: './fe/sticky-like-bottom-compatible.html', description: 'html 100% 版本'},
    {title: 'Scroll Loading..', address: './fe/scroll/' },
    {title: 'Sticky', address: './fe/scroll/sticky.html'},
    {title: '遍历 DOM-Tree', address: './walkdomtree/'},
    {title: 'Queue', address: './queue/', description: 'es3, Yield, Promise, CSS3' },
    {title: 'Style About Box', address: './fe/box-style.html'},
    {title: 'Border', address: './fe/border.html'},
    {title: 'Border-radius', address: './fe/border-radius.html'},
    {title: 'Box', address: './fe/box.html'},
    {title: 'Flex', address: './fe/flex/'},
    {title: 'CSS - Gradient', address: './fe/gradient.html'},
    {title: 'CSS layout', address: './layout/', description: 'Alt + Number 切换 css 文件)' },
    {title: 'CSS - Animation', address: './fe/animation.html' },
    {title: 'JavaScript - Animation', address: './fe/animation-javascript.html', description: '需要浏览器支持' },
    {title: 'CSS - Auto Transition', address: './fe/auto-transition.html', description: '自动 transition' },
    {title: 'simple-slide', address: './simpleslide/', description: '支持 Touch 事件' },
    {title: 'Object - JavaScript', address: './fe/object.txt', description: 'JavaScript 中 Object 方法/属性文档'}
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
