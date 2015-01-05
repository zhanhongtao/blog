
// @note:
// 对 css 理解不够好, 需要花时间补充css 基础.
// 对 html 语义理解差.

/*
  1. 黄色淡出效果 - RGB
  2. slide/tab
  3. 消息通知
  4. 类/Prototype 继承
*/

function createRGB() {
  var r = Math.floor( Math.random() * (1 + 255) );
  var g = Math.floor( Math.random() * (1 + 255) );
  var b = Math.floor( Math.random() * (1 + 255) );
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function $( selector, context ) {
  return (context || document).querySelector( selector );
}

function $$( selector, context ) {
  return (context || document).querySelectorAll( selector );
}

var grid = 100;
function uiupdate( page ) {
  box.style.marginTop = -1 * page * grid + 'px';
}

// 跟 slide 配置相关
var current = 0;
var total = 4;
function go( page ) {
  var from = current;
  var direction = page > current ? 'positive' : 'negative';
  // forward/backward
  var current = page > total ? 0 : page < 0 ? total : page;
  // 使用消息降低耦合性
  // uiupdate( current = page );
  slideProxy.notify( 'ui-update', current, direction, from );
}

function next() {
  go( current + 1 );
}

function prev() {
  go( current - 1 );
}

// 找到各个容器
var box = $( '#slide' );
var btnNext = $( '.next', box );
var btnPrev = $( '.prev', box );

// 绑定事件
btnNext.onclick = next;
btnPrev.onclick = prev;

// @note: 经常按自己的*意愿*写代码, 这样即浪费时间, 培训效果也会大打折扣.

// 引入消息通知机制.
// var Event = require( 'event.js' );

var slideProxy = new Event();

slideProxy.listen( 'ui-update', uiupdate );

// 再来业务时, 只需要相应的添加处理函数即可.
slideProxy.listen( 'ui-update', function( page, direction ) {
  console.log( 'current: ', page, direction );
});

var timer;
function animate( from, to, direction ) {
  if ( timer ) {
    clearInterval( timer );
  }
  var max = Math.abs( (to - from) * grid );
  var x = to > from ? -1 : 1;
  var base = -1 * to * grid;
  var delta = 0;
  timer = setInterval(function() {
    delta += ( max - delta ) * 0.2;
    if ( delta > max ) {
      delta = max;
      clearInterval( timer );
    }
    var top = base + delta * x;
    box.style.marginTop = top + 'px';
  }, 16);
}
