

// 测试删除层.
document.querySelector( '#remove-selected-layer' ).onclick = function() {
  removeSelectedLayer();
};

var images = [
  document.querySelector( '#test-image-demo' ).getAttribute( 'src', 2 )
  // 'http://www.baidu.com/img/bdlogo.gif'
  // document.querySelector( '#logo-baidu' ).getAttribute( 'src' )
];
images.forEach(function( src, index ) {
    addImageLayer( src );
});

// 测试保存.
// @note: 需要域名支持.
document.querySelector( '#save-canvas' ).onclick = function() {
  var src = save( 'image' );
  alert( src );
};


// 测试清除整个画面.
document.querySelector( '#clear-canvas' ).onclick = function() {
  clear();
};

// 锁定水平方向.
document.querySelector( '#lock-horizontal' ).onclick = function() {
  toggleLockHorizontal();
};

document.querySelector( '#lock-vertical' ).onclick = function() {
  toggleLockVertical();
};

// 禁止缩放
document.querySelector( '#lock-scale-x' ).onclick = function() {
  toggleLockScaleX();
}

document.querySelector( '#lock-scale-y' ).onclick = function() {
  toggleLockScaleY();
};

document.querySelector( '#toggle-edit-pattern' ).onclick = function() {
  toggleEditPattern();
};


document.querySelector( '#up-layer' ).onclick = function() {
  bringFroward();
};

document.querySelector( '#up-to-top-layer' ).onclick = function() {
  bringToFront();
};

document.querySelector( '#down-layer' ).onclick = function() {
  sendBackwards();
};

document.querySelector( '#down-to-low-layer' ).onclick = function() {
  sendToBack();
};

