var default_item_width = 240;
var box = document.getElementById( 'box' );
var helper = document.getElementById( 'box-helper' );
var list = box.getElementsByTagName( 'li' );
helper.style.width = list.length * default_item_width + 'px';

var myslide = slide({
  max: list.length,
  rotate: true,
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
  }
});

var btns = box.getElementsByTagName( 'button' );
for ( var i = 0, l = btns.length; i < l; ++i ) {
  btns[i].onclick = function() {
    var className = this.className;
    if ( className === 'next' ) {
      myslide.next();
    }
    else if ( className == 'prev' ) {
      myslide.prev();
    }
  };
}


var instance = document.getElementById( 'instance' );
var instanceHelper = document.getElementById( 'instance-helper' );
var instanceList = instance.getElementsByTagName( 'li' );
var finily_item_width = default_item_width + 5;
var per = 2;
instance.style.width = default_item_width * per + 'px';
instanceHelper.style.width = instanceList.length * finily_item_width + 'px';

var rslide = slide({
  auto: true,
  timeout: 2,
  rotate: false,
  step: 2,
  per: per,
  max: instanceList.length,
  onchange: function( to, from, oto ) {
    // oto/from 确认方向.
    var i = 0;
    while ( i < per * 2 ) {
      var index = to + i;
      if ( index < instanceList.length ) {
        var img = instanceList[index].getElementsByTagName( 'img' )[0];
        if ( !img.loaded ) {
          img.src = img.getAttribute( 'data-src' );
          img.loaded = 1;
        }
      }
      ++i;
    }
    
    if ( from !== to ) {
      var start = from * finily_item_width;
      var end = to * finily_item_width;
      simple( 350, 'easeOut', function( p ) {
        instanceHelper.style.marginLeft = -1 * start + ( start - end ) * p + 'px';
      });
    }

	if ( oto === this.config.max ) {
		rslide.pause();
	}

  }
});

var btns = instance.getElementsByTagName( 'button' );
for ( var i = 0, l = btns.length; i < l; ++i ) {
  btns[i].onclick = function() {
    var className = this.className;
    if ( className === 'next' ) {
      rslide.next();
    }
    else if ( className == 'prev' ) {
      rslide.prev();
    }
  };
}
