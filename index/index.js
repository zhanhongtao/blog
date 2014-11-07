var about = {
  title: 'About Me',
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
  title: 'Blog',
  description: '记录工作生活的点点滴滴',
  address: 'https://github.com/zhanhongtao/blog/issues?state=open',
  labels: [ '算法', '二进制', '语法', 'JavaScript', 'HTML', 'CSS', 'Node', 'XSS', 'other' ],
  shares: [
    {title: 'scroll loading..', address: './fe/scroll/' },
    {title: 'sticky', address: './fe/scroll/sticky.html'},
    {title: '遍历 DOM-Tree', address: './walkdomtree/'},
    {title: 'queue', address: './queue/', description: 'es3, Yield, Promise, CSS3' },
    {title: 'simple-slide', address: './simpleslide/', description: '支持 Touch 事件' },
    {title: 'Lottery', address: './lottery/', description: '抽奖小程序' },
    {title: 'JavaScript - Animation', address: './fe/animation-javascript.html', description: '需要浏览器支持' },
    {title: 'css - Animation', address: './fe/animation.html' },
    {title: 'css - Auto Transition', address: './fe/auto-transition.html', description: '自动 transition' },
    {title: 'Object - JavaScript', address: './fe/object.txt', description: 'JavaScript 中 Object 方法/属性文档'},
    {title: 'layout - css', address: './layout/', description: 'alt + Number 切换 css 文件)' },
    {title: 'expand-select', address: './expandselect/', description: '可使用 shift 辅助选择'},
    {title: 'css 之 flex', address: './fe/flex/'},
    {title: 'css 之 desktop', address: './desktop/'},
    {title: 'border', address: './fe/border.html'},
    {title: 'border-radius', address: './fe/border-radius.html'},
    {title: 'Ajax', address: './fe/ajax.txt', description: 'Ajax 相关文档' },
    {title: 'selctor', address: './fe/selector/' }
  ]
};

var github = {
  address: 'http://github.com/zhanhongtao',
  repositories: [
    {
      title: 'rt.js',
      description: '一款基于 JavaScript 语法的模板引擎',
      address: 'https://github.com/zhanhongtao/rt.js',
      demo: 'http://zhanhongtao.github.io/blog/rt/'
    },
    {
      title: 'jQuery.slide.js',
      description: '可定制化 jQuery slide 插件',
      address: 'http://github.com/zhanhongtao/jQuery.slide.js',
      demo: 'http://zhanhongtao.github.io/jQuery.slide.js/index.html'      
    },
    {
      title: 'encode',
      description: 'web前端开发编码工具',
      address: 'https://github.com/zhanhongtao/encode',
      demo: 'http://zhanhongtao.github.io/encode/'
    }
  ]
};

var config = {
  about: about,
  blog: blog,
  github: github
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


