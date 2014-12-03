
;(function( root ) {

// 支持全局定义语言.
// 要求 0-6 顺序.
var weekTextList = [
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六'
];

var calendar = root.calendar = function( config ) {
  if ( !(this instanceof calendar) ) {
    return new calendar( config );
  }
  var config = this.config = $.extend( {}, calendar.defaultConfig, config );
  this.today = this.date = config.date ? new Date( config.date ) : new Date;
  this.box = config.box;
  this.start = config.start;
  fixedWeekList( this.start );
  this.init();
};

calendar.defaultConfig = {
  // 星期规则 - 即认为从星期几开始显示.
  start: 0,
  // 样式规则.
  classes: {
    // 当天
    today: 'today',
    // 非当月天
    'not-current-month': 'not-current-month',
    // 周末
    weekend: 'weekend',
    // 范围
    disabled: 'disabled'
  },
  grid: function( data ) {
    var list = [];
    var config = this.config;
    for ( var key in config.classes ) {
      if ( config.classes.hasOwnProperty(key) ) {
        var value = config.classes[key];
        switch( key ) {
          case 'today':
            if ( this.today.getFullYear() == data.year &&
              this.today.getMonth() == data.month &&
              this.today.getDate() == data.day ) {
              list.push(value);
            }
            break;
          case 'not-current-month':
            !data.current && list.push(value);
            break;
          case 'weekend':
            ( data.week == 0 || data.week == 6 ) && list.push(value);
            break;
          case 'disabled':
            !inRange(
              new Date( data.year, data.month, data.day ),
              [this.min, this.max]
            ) && list.push(value);
            break;
          default:
            break;
        }
      }
    }
    return '<div class="item ' + list.join(' ') + '">' + data.day + '</div>';
  }
};

function fixedWeekList( start ) {
  while( start-- > 0 ) {
    weekTextList.push( weekTextList.shift() );
  }
}

function firstDayOfDate( day, week ) {
  day = day % 7;
  while ( day > 1 ) {
    --week;
    --day;
  }
  return ( 7 + week % 7 ) % 7;
  // 或
  // return new Date( year, month, 1 ).getDay();
}

function isLeapYear( year ) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0 );
}

function getDaysInMonth( year, month ) {
  var days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  return month === 1 && isLeapYear(year) ? 29 : days[month];;
  // 或者 
  // return new Date( year, month, 0 ).getDate();
}

function inRange( date, range ) {
  var min = range[0], max = range[1];
  if ( !min && !max ) return true;
  var bottom = new Date( min ).getTime();
  date = date instanceof Date ? date : new Date( date );
  var test = date.getTime();
  if ( !max ) return test >= bottom;
  var top = new Date( max ).getTime();
  return test >= bottom && test <= top;
}

function swap() {
  return [].slice.call(arguments).sort(function( a, b ) {
    a = a instanceof Date ? a : new Date(a);
    b = b instanceof Date ? b : new Date(b);
    return a.getTime() - b.getTime();
  });
}

function fixedWeek( week ) {
  return (7 + week % 7) % 7;
}

// @NOTE: 只修正一个值.
function calc( obj ) {
  var year = obj.year, month = obj.month, day = obj.day;
  var days = getDaysInMonth( year, month );
  if ( day > days ) {
    ++month;
  } else if ( day < 1 ) {
    --month;
  }
  if ( month > 11 ) {
    ++year;
    month = 0;
  } else if ( month < 0 ) {
    --year;
    month = 11;
  }
  var days = getDaysInMonth( year, month );
  obj.year = year, obj.month = month, obj.day = day <= days ? day : days;
  return obj;
}

// 方便重写 render 方法.
calendar.util = {
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  getDaysInMonth: getDaysInMonth,
  weekTextList: weekTextList,
  fixedWeek: fixedWeek,
  calc: calc
};

$.each(['next', 'prev'], function(i, prefix) {
  $.each(['year', 'month', 'day'], function(j, type) {
    var _type = type.charAt(0).toUpperCase() + type.slice(1);
    calendar.prototype[ prefix + _type ] = function() {
      var date = this.date, obj = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      };
      obj[type] = obj[type] + ( prefix == 'next' ? 1 : -1 );
      obj = calc(obj, type);
      this.date = new Date( [obj.year, obj.month + 1, obj.day].join('/') );
    };    
  });
});

calendar.prototype.gridpanel = function( func ) {
  var disabled = false, selected = false;
  var date = this.date;
  var theWeekOfFirstDay = firstDayOfDate( date.getDate(), date.getDay() );
  var index = 0;
  var paddingDays = ( 7 - this.start + theWeekOfFirstDay ) % 7;
  paddingDays = paddingDays == 0 ? 7 : paddingDays;

  // 需要补充格子 - 上个月日期
  if ( paddingDays ) {
    var _date = calc( {year: date.getFullYear(), month: date.getMonth() - 1, day: date.getDate()} ),
        days = getDaysInMonth( _date.year, _date.month ) - paddingDays,
        week = this.start;
    while( paddingDays > 0 ) {
      func({
        year: _date.year,
        month: _date.month,
        day: ++days,
        week: fixedWeek(week++),
        disabled: disabled,
        selected: selected,
        index: index++,
        current: false
      });
      --paddingDays;
    }
  }

  // 当月格子.
  var year = date.getFullYear(),
      month = date.getMonth(),
      days = getDaysInMonth( year, month ),
      week = theWeekOfFirstDay,
      i = 1;
  while ( i <= days ) {
    func({
      year: year,
      month: month,
      day: i++,
      week: fixedWeek(week++),
      disabled: disabled,
      selected: selected,
      index: index++,
      current: true
    });
  }

  // 补充格子 - 下个月.
  // 28, 29, 30, 31 => +6 => 7 * 6
  if ( index <= 42 ) {
    var _date = calc( {year: date.getFullYear(), month: date.getMonth() + 1, day: 1} ),
        i = 1;
    while ( index < 42 ) {
      func({
        year: _date.year,
        month: _date.month,
        day: i++,
        week: fixedWeek(week++),
        disabled: disabled,
        selected: selected,
        index: index++,
        current: false
      });
    }
  }

};

calendar.prototype.today = function() {
  return this.today;
};

calendar.prototype.gototoday = function() {
  this.date = this.old;
  return this.render();
};

calendar.prototype.inmonth = function( date ) {
  var t = new Date( date );
  return t.getFullYear() === this.date.getFullYear() &&
      t.getMonth() == this.date.getMonth();
};

calendar.prototype.get = function() {
  return this.selected;
};

calendar.prototype.set = function( min, max ) {
  var config = this.config,
      _min = config.min,
      _max = config.max;
  max = max ? max : _max;
  var mins = swap( min, _min );
  var maxs = swap( max, _max );
  this.selected = [ mins[1], maxs[0] ];
  return this;
};

calendar.prototype.init = function() {
  this.render();
  // @todo: 使用消息.
  var onclick = this.config.click;
  var self = this;
  $( this.box ).on( 'click', 'td', function(e) {
    var date = new Date( $(this).data('date') );
    this.selected = date;
    onclick.call( self, date, this );
  });
  return this;
};

// @todo: 支持重新定义 render
calendar.prototype.render = function() {
  var config = this.config,
      self = this,
      html = '';

  if ( !config.onlygrid ) {
    // 拼头部导航
    html += '<table class="calendar">';
    var year = this.date.getFullYear(),
    month = this.date.getMonth();
    html += '<caption class="clearfix">';
    html += '<a class="action calendar-prev" data-id="prev-month">&lt;&lt;</a>';
    html += year + '年' + (month + 1) + '月';
    html += '<a class="action calendar-next" data-id="next-month">&gt;&gt;</a>';
    html += '</caption>';
  }

  // 拼星期
  html += '<tr>';
  for ( var i = 0; i < 7; ++i ) {
    html += '<th>' + weekTextList[i] + '</th>';
  }
  html += '</tr>';

  // 拼格子
  var config = this.config, self = this;
  this.gridpanel(function(data) {
    var index = data.index;
    if ( index % 7 === 0 ) {
      html += '<tr>'
    }
    var date = [ data.year, data.month + 1, data.day ].join('-');
    html += '<td data-date="' + date + '" data-week="' + data.week + '">';
    html += config.grid.call(self, data);
    html += '</td>';
    if ( index % 7 === 6 ) {
      html += '</tr>';
    }
  });

  // 结束.
  html += '</table>';

  $( this.box ).html( html );
  return this;
};

})( this );


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

