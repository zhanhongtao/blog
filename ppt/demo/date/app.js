
var box = $( '#box' );

// @todo: class 规则, 简单化.
var c = calendar({
  box: box,
  // @todo: 使用消息通知方式.
  click: function( date, dom ) {
    console.log( 'selected date: ', date );
    var item = $( dom ).find( '.item' );
    box.find( '.selected' ).removeClass( 'selected' );
    $( dom ).find( '.item' ).addClass( 'selected' );
  }
});

// @NOTE: 事件有使用者绑定.
box.on( 'click', '.action', function() {
  var id = $(this).data('id');
  switch( id ) {
    case 'next-month':
      c.nextMonth();
      break;
    case 'prev-month':
      c.prevMonth();
      break;
    default:
      break;
  }
  c.render();
});
