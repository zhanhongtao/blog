
var colorRandom = (function() {
  var colors = [
    '#ff66cc', '#ffcccc', '#ffccff', '#996699', '#663333', '#cc9999', '#cccccc'
  ], l = colors.length - 1;
  var last = -1;
  return function() {
    var index = Math.floor( Math.random() * l );
    var color = colors[ index ];
    colors[ index ] = colors[ l ];
    colors[ l ] = color;
    return color;
  };
})();

function appendNewFeeds( n ) {
  var i = 0;
  var html = [];
  html.push( '<ul>' );
  while ( i < n ) {
    html.push( '<li style="background-color: ' + colorRandom() +';"></li>' );
    ++i;
  }
  html.push( '</ul>' );
  box.innerHTML = box.innerHTML + html.join('');
}

function displayLoading( flag ) {
  loading.style.display = flag ? 'block' : 'none';
}

function createRequestNewFeeds( config ) {
  var loading = false;
  var changeState = function( flag ) {
    loading = flag;
    displayLoading( flag );
    if ( !flag && config.done ) config.done();
  };
  return function() {
    if ( loading == true ) return;
    changeState( true );
    setTimeout(function() {
      changeState( false );
      appendNewFeeds( 10 );
    }, Math.random() * 2 * 1000 );
  };
}

var handle = (function () {
  var lastScrollTop = 0;
  return function(e) {
    var scrollTop = window.pageYOffset || document.body.scrollTop;
    if ( lastScrollTop < scrollTop ) {
      lastScrollTop = scrollTop;
      var winHeight = window.innerHeight || document.documentElement.clientHeight;
      var documentHeight = Math.max( 
        (document.documentElement || document.body).scrollHeight,
        (document.documentElement || document.body).offsetHeight,
        document.documentElement.clientHeight
      );
      if ( documentHeight - winHeight - scrollTop < scrollOffsetHeight ) {
        requestNewFeeds();
      }
    }
  };
})();

var box = document.getElementById( 'box' );
var loading = document.getElementById( 'loading' );
var scrollOffsetHeight = 100;
var requestNewFeeds = createRequestNewFeeds({
  times: 5,
  done: function() {
    --this.times;
    if ( this.times === 0 ) {
      document.removeEventListener( 'scroll', handle );
    }
  }
});
appendNewFeeds( 15 );

document.addEventListener( 'scroll', handle, false );
