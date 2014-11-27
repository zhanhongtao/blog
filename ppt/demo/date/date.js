
;(function( root ) {

var calendar = root.calendar = function( config ) {
  if ( !(this instanceof calendar) ) {
    return new calendar( config );
  }
  this.today = this.date = config.date ? new Date( config.date ) : new Date;
  this.box = config.box;
  this.start = 0;  // 认为周日是第一天.
  this.min = '2014-11-10';
  this.max = '2014-12-31';
  this.gridclass = 'item';
  this.selectedclass = 'selected';
  fixedWeekList( this.start );
  this.init();
};

{
  // @todo: 放到类里面.
  var weekTextList = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ];
};

function type(s) {
  return Object.prototype.toString.call(s).slice( 8, -1 ).toLowerCase();
}

function fixedWeekList( start ) {
  if ( start === 0 ) {
    var d = weekTextList.pop();
    weekTextList.unshift(d);
  }
}

function firstDayOfDate( day, week ) {
  day = day % 7;
  while ( day > 1 ) {
    --week;
    --day;
  }
  return ( 7 + week % 7 ) % 7;
}

function isLeapYear( year ) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0 );
}

function getDaysInMonth( year, month ) {
  var days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  return month === 1 && isLeapYear(year) ? 29 : days[month];;
}

function inRange( date, range ) {
  var min = range[0], max = range[1];
  var bottom = new Date( min ).getTime();
  var top = new Date( max ).getTime();
  date = date instanceof Date ? date : new Date( date );
  var test = date.getTime();
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
  return week > 6 ? 0 : week < 0 ? 6 : week;
}

function valideDateFormat( date ) {
  return /^\d{4}([-\/])\d\d\1\d\d$/.test( date );
}

// @todo: 网页里面怎么补充空白
function padding( num ) {
  num = +num;
  return '' + (num < 10 ? ' ' + num : num);
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

function render( instance ) {
  var self = instance;
  var html = '';

  // 拼头部导航
  html += '<table>'
  var year = self.date.getFullYear(), month = self.date.getMonth();
  html += '<caption class="clearfix"><button class="btn-prev" data-id="prev-month">Previous</button>';
  html += [ year, month + 1 ].join('/');
  html += '<button class="btn-next" data-id="next-month">Next</button></caption>';

  // 拼星期
  html += '<tr>';
  self.weekpanel(function( value ) {
    html += '<th>' + value + '</th>';
  });
  html += '</tr>';

  // 拼格子
  var today = self.date.getDate();
  var month = self.date.getMonth();
  self.gridpanel(function(data) {
    var current = data.current;
    var classlist = [];
    if ( today == data.day && month === data.month ) classlist.push( 'today' );
    if ( !current ) classlist.push( 'not-current-month' );
    var index = data.index;
    var title = [ data.year, data.month + 1, data.day ].join('-');
    if ( index % 7 === 0 ) {
      html += '<tr>'
    }
    html += '<td class="item ' + ( classlist.join(' ') ) + '" title="' + title + '">' + padding(data.day) + '</td>';
    if ( index % 7 === 6 ) {
      html += '</tr>';
    }
  });

  // 结束.
  html += '</table>';
  return html;
};

// 方便重写 render 方法.
calendar.util = {
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  getDaysInMonth: getDaysInMonth,
  weekTextList: weekTextList,
  fixedWeek: fixedWeek,
  calc: calc
};

[ 'next', 'prev' ].forEach(function( prefix ) {
  [ 'year', 'month', 'day' ].forEach(function( type ) {
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

calendar.prototype.today = function() {
  return this.today;
};

calendar.prototype.weekpanel = function( func ) {
  for ( var i = 0; i < 7; ++i ) {
    func( weekTextList[i], i );
  }
}

calendar.prototype.gridpanel = function( func ) {
  var disabled = false, selected = false;
  var date = this.date;
  var theWeekOfFirstDay = firstDayOfDate( date.getDate(), date.getDay() );
  var index = 0;

  theWeekOfFirstDay = theWeekOfFirstDay == this.start ? theWeekOfFirstDay + 7 : theWeekOfFirstDay;

  // 需要补充格子 - 上个月日期
  if ( theWeekOfFirstDay > this.start ) {
    var week = theWeekOfFirstDay - 1;
    var _date = calc( {year: date.getFullYear(), month: date.getMonth() - 1, day: date.getDate()} ),
        days = getDaysInMonth( _date.year, _date.month ) - week;
    while( week >= 0 ) {
      func({
        year: _date.year,
        month: _date.month,
        day: days++,
        week: fixedWeek(--week),
        disabled: disabled,
        selected: selected,
        index: index++,
        current: false
      });
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

calendar.prototype.gototoday = function() {
  this.date = this.old;
  return this;
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
  max = max ? max : this.max;
  var _min = swap( min, this.min );
  var _max = swap( max, this.max );
  this.selected = [ _min[1], _max[0] ];
};

function handle( target, self, event ) {
  var className = target.className;
  var reg = new RegExp( '\\b' + self.gridclass + '\\b', 'g' );
  var selectedReg = new RegExp( '\\b' + self.selectedclass + '\\b', 'g' );
  // 目前只支持单个值.
  // @todo: 支持区间.
  if ( reg.test(className) ) {
    // 取消.
    if ( selectedReg.test(className) ) {
      self.selected = [];
      target.classList.remove( self.selectedclass );
    } else {
      // 设置.
      var min = target.getAttribute( 'title' );
      // @todo: 确认 value 合法性.
      if ( min ) {
        self.selected = [min];
        var needRemoveClassGrid = self.box.querySelectorAll( '.' + self.selectedclass );
        [].slice.call(needRemoveClassGrid).forEach(function( grid ) {
          grid.classList.remove( self.selectedclass );
        });
        target.classList.add( self.selectedclass );
      }
    }
  }
}

calendar.prototype.init = function() {
  var self = this;
  function createHTML() {
    var html = render( self );
    self.box.innerHTML = html;
  }

  createHTML();

  this.box.onclick = function( e ) {
    var target = e.target,
        dataset = target.dataset;
    switch( dataset.id ) {
      case 'next-month':
        self.nextMonth();
        createHTML();
        break;
      case 'next-year':
        self.nextYear();
        createHTML();
        break;
      case 'prev-month':
        self.prevMonth();
        createHTML();
        break;
      case 'prev-year':
        self.prevYear();
        createHTML();
        break;
      default:
        handle( target, self, e );
        break;
    }
  };
};

})( this );

var c = calendar({
  box: document.getElementById('box')
});
