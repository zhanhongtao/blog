
// 如何扩展对象.
// 1. 静态方法
// 2. 原型方法

/**
  jQuery
  1. jQuery.method
  2. jQuery.prototype
*/
var uuid = (function() {
  var prefix = '_YOUR_PROJECT_NAME_';
  var id = 0;
  return function() {
    id += 1;
    return prefix + id;
  };
})();

// 静态方法
$.uuid = uuid;

// 使用命名空间
$.learn = {
  uuid: $.uuid
};

$.learn.uuid();

// 使用内置的 .extend 方法
$.extend( {
  log: function() {
    console.log.apply( console, arguments );
  }
});

// 原型方法
$.fn.uuid = uuid;
// $.fn = $.prototype;
// https://github.com/jquery/jquery/blob/master/src/core.js

// 完整例子
;(function( $ ) {
  var uuid = (function() {
    var prefix = '_YOUR_PROJECT_NAME_';
    var id = 0;
    return function() {
      id += 1;
      return prefix + id;
    };
  })();
  $.fn.uuid = uuid;  
})( jQuery );


// 实现运行代码插件
;(function( $ ) {

$.fn.runcode = function() {
  return $(this).each(function( index, dom ) {
    var code = $(dom).text();
    eval(code);
  });
};

})( jQuery );

// 使用插件.
$( 'pre' ).on( 'click', function() {
  $(this).runcode();
});

// 格式化代码.
;(function($) {
  
  // 普通函数调用
  function format( dom, options ) {
    $(dom).css(options);
  }
  
  // 定义默认配置
  var default_options = {
    background: '#faa',
    color: '#fff',
    padding: '10px',
    margin: '10px'
  };
  
  $.fn.format = function( options ) {
    // 合并用户配置.
    var setting = $.extend( {}, default_options, options );
    return $(this).each(function( index, dom ) {
      if ( dom.nodeType == 1 ) {
        var tag = dom.nodeName.toLowerCase();
        var tagReg = /pre|code/ig;
        if ( tagReg.test(tag) ) {
          format( dom, setting );
        }
      }
    });
  };
  
  // 对外开放, 用户可在修改全局配置
  $.fn.format.defaultSetting = default_options;
  
  // 提供静态方法.
  $.format = function( dom, options ) {
    var setting = $.extend( {}, default_options, options );
    format( dom, setting );
  };
  
  // 在静态方法上绑定, 以支持在静态方法上修改全局配置.
  $.format.defaultSetting = default_options;
  
})( jQuery );

// 开始格式化
/*
$( '.code' ).format({
  background: '#000',
  color: '#fff'
});
*/
$.format( $('.code') );

// 配置可写到 data- 属性上.
;(function($) {
  
  // 初始化 RUN
  // 只存在一个实例.
  var run = $( '<a class="run">Run</a>' ).css( 'padding', '2px 15px' );
  
  // 绑定行为
  run.on( 'click', function() {
    var dom = $.data(run);
    if ( dom ) {
      $(dom).runcode();
    }
  });
  
  // fix.
  run.on( 'mouseenter', function() {
    if ( timer ) {
      clearTimeout( timer );
    }
  });
  $( 'body' ).append( run );
  
  var size = {
    w: run.outerWidth(),
    h: run.outerHeight()
  };
  var timer;
  
  function init( dom ) {
    $(dom).on( 'mouseenter', function() {
      if ( timer ) clearTimeout( timer );
      $.data( run, this );
      var offset = $(dom).offset();
      var width = $(dom).outerWidth();
      run.css({
        top: offset.top,
        left: offset.left + width - size.w
      }).show();
    });
    $(dom).on( 'mouseleave', function() {
      timer = setTimeout(function() {
        $.data( run, null );
        run.hide();
      }, 100);
    });
  }
  
  // 自执行.
  $( '.code' ).each(function( index, dom ) {
    var setting = $(dom).data();
    if ( setting.run ) {
      init(dom);
    }
  });
  
})( jQuery );
