

// 测试删除层.
document.querySelector( '#remove-selected-layer' ).onclick = function() {
  removeSelectedLayer();
};


// 测试添加图片层.
var images = [
  'http://localhost:4324/11.jpg',
  'http://www.baidu.com/img/bdlogo.gif'
];
images.forEach(function( src ) {
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
}
