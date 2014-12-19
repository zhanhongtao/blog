;(function() {

  var TARGET_CLASS = 'target';
  var TARGET_FROM_DIRECTION_PREV_CLASS = 'prev';
  var TARGET_FROM_DIRECTION_NEXT_CLASS = 'next';
  var nav = document.querySelector( '#navigator' );

  var selector = /[?&#]v=1/i.test( location.href ) ? '.slide' : '.slide:not(.toggle)';
  var slides = document.querySelectorAll( selector );
  var eventemitter = eventEmitter();

  function updateui( message ) {
    var page = message.page;
    var pages = message.pages;

    // 隐藏 page.
    var old = document.querySelector( '.' + TARGET_CLASS );
    if ( old ) {
      old.classList.remove( TARGET_CLASS );
    }

    [ TARGET_CLASS, TARGET_FROM_DIRECTION_NEXT_CLASS, TARGET_FROM_DIRECTION_PREV_CLASS ].forEach(function( className ) {
      try {
        document.querySelector( '.' + className ).classList.remove( className );
      } catch(e) {}
    });

    var target = slides[ page ];
    target.classList.add( TARGET_CLASS );
    if ( page != message.prev )
      slides[ message.prev ].classList.add( TARGET_FROM_DIRECTION_PREV_CLASS );
    if ( page != message.next )
    slides[ message.next ].classList.add( TARGET_FROM_DIRECTION_NEXT_CLASS );

    // 让元素可见.
    target.scrollTop = 0;
    // @todo: 查找第一个可拿到焦点的元素.
    target.focus();

    // 检查背景.
    var dataset = target.dataset;
    [ 'color', 'image', 'repeat', 'position', 'size' ].forEach(function( key ) {
      if ( dataset[key] ) {
        var value = dataset[key];
        if ( key == 'image' ) {
          value = 'url(' + value + ')';
        }
        target.style[ 'background-' + key ] = value;
      }
    });

    // 更新 title.
    if ( dataset.title ) {
      document.title = dataset.title;
    } else {
      var h1 = target.querySelector( 'h1' );
      if ( h1 ) {
        eventemitter.emit( 'innerText', h1, function( title ) {
          document.title = title;
        });
      }
    }

    // 执行 code.
    var pres = target.querySelectorAll( '.code' );
    Array.prototype.forEach.call( pres, function( dom ) {
      var dataset = dom.dataset;
      if ( dataset.autorun == '1' ) {
        var code = dom.querySelector( 'code' );
        if ( code ) {
          eventemitter.emit( 'code', {
            cmd: 'run',
            element: code
          });
        }
      }
    });

    // 更新进度条.
    nav.style.width = ( (page+1) / pages ) * 100 + '%';

  };

  eventemitter.on( 'on-page-changed', function( message ) {
    updateui( message );
  });

  eventemitter.on( 'on-page-pattern-changed', function( page ) {
    document.body.classList.toggle( 'ppt' );
  });

  // 初始化代码.
  var pres = document.querySelectorAll( 'pre.code' );
  Array.prototype.forEach.call( pres, function( pre ) {
    // @NOTE: 使用 pre.innerHTML 取 code 时, 浏览器会自动把特殊字符转义.
    var codeText = pre.firstChild.nodeValue;
    codeText = codeText.replace( /^(?:\s*|\\r?\\n*)/, '' );
    var dataset = pre.dataset;

    var code = document.createElement( 'code' );
    code.className = dataset.type;
    code.setAttribute( 'contenteditable', true );
    if ( dataset.maxHeight ) {
      code.style.maxHeight = dataset.maxHeight + 'px';
    }
    if ( dataset.id ) {
      code.id = dataset.id;
    }
    var text = document.createTextNode( codeText );
    code.appendChild( text );
    
    pre.innerHTML = '';
    pre.appendChild( code );
    if ( dataset.run == '1' ) {
      var run = document.createElement( 'div' );
      run.className = 'runcase';
      run.innerHTML = 'Run';
      pre.appendChild( run );
    }
  });

  // 设置 tab 对应空白.
  // 初始化语法高亮
  hljs.tabReplace = '  ';
  hljs.initHighlightingOnLoad();

})();

