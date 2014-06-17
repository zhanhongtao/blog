
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
      type: 'email'
    },
    { 
      label: 'Github',
      value: 'http://github.com/zhanhongtao',
      type: 'link'
    },
    { 
      label: '公司',
      type: 'text',
      value: 'sogou.com' 
    }
  ],
  label: [ '程序员', '前端工程师' ]
};

var blog = {
  title: 'Blog',
  description: '记录工作生活的点点滴滴',
  address: 'https://github.com/zhanhongtao/blog/issues?state=open',
  labels: [ '算法', 'JavaScript', 'html', 'css', 'node', 'xss', 'other' ],
  shares: [
    {title: 'xss - 编码', address: 'http://zhanhongtao.github.io/blog/xss/#0'},
    {title: 'queue - promise/coroutine', address: 'http://zhanhongtao.github.io/blog/queue/' },
    {title: 'css 之 flex', address: 'http://zhanhongtao.github.io/blog/flex/', code: 'https://github.com/zhanhongtao/blog/tree/gh-pages/flex'},
    {title: 'css 之 desktop', address: 'http://zhanhongtao.github.io/blog/desktop/'},
    {title: 'function', address: 'http://zhanhongtao.github.io/blog/slide/#0'},
    {title: 'border', address: 'http://zhanhongtao.github.io/blog/fe/border.html'},
    {title: 'border-radius', address: 'http://zhanhongtao.github.io/blog/fe/border-radius.html'},
    {title: 'selctor', address: 'http://zhanhongtao.github.io/blog/fe/selector/' }
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

