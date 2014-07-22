var box = document.querySelector( 'section' );

// 给各个伸缩项目添加背景色.
;(function( box ) {
  var divs = box.querySelectorAll( 'div' );
  for ( var i = 0, l = divs.length; i < l; i++ ) {
    var div = divs[i];
    var r = Math.floor( Math.random() * ( 255 -140 ) + 140 );
    var g = Math.floor( Math.random() * ( 255 -140 ) + 140 );
    var b = Math.floor( Math.random() * ( 255 -140 ) + 140 );
    div.style.backgroundColor = 'rgb('+r+','+g+','+b+')';
    div.style.lineHeight = Math.floor( Math.random() * 2 );
  }
})( box );

// 给 radio 绑定事件.
document.addEventListener( 'click', function( event ) {
  var target = event.target;
  if ( target.webkitMatchesSelector('input[type=radio]') ) {
    var name = target.getAttribute( 'name' );
    name = name.replace(/(^|-)./g, function( r0, r1 ) {
      return r0.replace('-', '' ).toUpperCase();
    });
    // 仅支持 webkit.
    box.style[ 'webkit' + name ] = target.value;
  }
}, false );

var rangeElement = document.querySelectorAll( 'input[type=range]' );
for ( var i = 0, l = rangeElement.length; i < l; i++ ) {
  rangeElement[i].addEventListener( 'change', function() {
    var target = this;
    var name = target.getAttribute( 'name' );
    var fix = target.dataset.fix;
    console.log( fix );
    box.style[ name ] = target.value + ( fix ? fix : '' );
  });
}

