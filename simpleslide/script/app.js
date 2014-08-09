var default_item_width = 240;
var box = document.getElementById( 'box' );
var helper = document.getElementById( 'box-helper' );
var list = box.getElementsByTagName( 'li' );

var myslide = slide({
  auto: false,
  timeout: 2,
  max: list.length,
  onchange: function( to, from, oto ){
    var i = 0;
    while ( i < 2 ) {
      var index = to + i;
      if ( index < list.length ) {
        var img = list[index].getElementsByTagName( 'img' )[0];
        if ( !img.loaded ) {
          img.src = img.getAttribute( 'data-src' );
          img.loaded = 1;
        }
      }
      ++i;
    }
    // 直接使用 css3 的 transition 实现.
    helper.style.marginLeft = -1 * to * default_item_width + 'px';
    /*!
    if ( from !== to ) {
      var start = from * default_item_width;
      var end = to * default_item_width;
      simple( 250, 'easeOut', function( p ) {
      helper.style.marginLeft = -1 * start + ( start - end ) * p + 'px';
      });
    }
    */
  }
});

document.getElementById( 'prev' ).onclick = function() {
  myslide.prev();
};

document.getElementById( 'next' ).onclick = function() {
  myslide.next();
};