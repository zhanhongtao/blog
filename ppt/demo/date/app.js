
var box = $( '#box' );

// @todo: class 规则, 简单化.
var c = calendar({
  box: box,
  min: new Date,
  // max: '2015-05-06',
  // @todo: 使用消息通知方式.
  click: function( dom, date ) {
    box.find( '.selected' ).removeClass( 'selected' );
    $(dom).addClass( 'selected' );
  }
});

c.init().render();

// @NOTE: 事件有使用者绑定.
box.on( 'click', '.action', function() {
  var id = $(this).data('id');
  switch( id ) {
    case 'next-month':
      if (c.btnNext) {
        c.nextMonth();
      }
      break;
    case 'prev-month':
      if(c.btnPrev) {
        c.prevMonth();
      }
      break;
    default:
      break;
  }
  c.render();
});
