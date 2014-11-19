
;(function( root ) {
  
{
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

function fixedWeek( week ) {
  return week > 6 ? 0 : week < 0 ? 6 : week;
}

var calendar = root.calendar = function( config ) {
  if ( !(this instanceof calendar) ) {
    return new calendar( config );
  }
  this.date = config.date ? new Date( config.date ) : new Date;
  this.box = config.box;
  // 认为周日是第一天.
  this.start = 0;
  fixedWeekList( this.start );
  this.init();
  this.render();
};

// 方便重写 render 方法.
calendar.util = {
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  getDaysInMonth: getDaysInMonth,
  weekTextList: weekTextList,
  fixedWeek: fixedWeek
};

calendar.prototype.createTitle = function( func ) {
  var date = this.date;
  var year = date.getFullYear(), 
      month = date.getMonth(),
      day = date.getDate();
  func( year, month, day, date );
};

calendar.prototype.createWeekPanel = function( func ) {
  for ( var i = 0; i < 7; ++i ) {
    func( weekTextList[i], i );
  }
}

calendar.prototype.createGrid = function( func ) {
  var disabled = false, selected = false;
  var date = this.date;
  var theWeekOfFirstDay = firstDayOfDate( date.getDate(), date.getDay() );
  var index = 0;
  
  theWeekOfFirstDay = theWeekOfFirstDay == this.start ? theWeekOfFirstDay + 7 : theWeekOfFirstDay;
  
  // 需要补充格子 - 上个月日期
  if ( theWeekOfFirstDay > this.start ) {
    var week = theWeekOfFirstDay - 1;
    var _date = calc( date.getFullYear(), date.getMonth() - 1 ),
        year = _date.getFullYear(),
        month = _date.getMonth(),
        days = getDaysInMonth( year, month ) - week;
    while( week >= 0 ) {
      func({
        year: year,
        month: month,
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
    var _date = calc( date.getFullYear(), date.getMonth() + 1 ),
        year = _date.getFullYear(),
        month = _date.getMonth(),
        i = 1;
    while ( index < 42 ) {
      func({
        year: year,
        month: month,
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

calendar.prototype.disabled = function( date ) {
  // @todo.
};

calendar.prototype.selected = function( date ) {
  // @todo.
};

calendar.prototype._render = function() {
  var html = '';
  
  // 拼头部导航
  html += '<table>'
  this.createTitle(function( year, month ) {
    html += '<caption class="clearfix"><button class="btn-prev" data-id="prev-month">Previous</button>';
    html += [ year, month + 1 ].join('/');
    html += '<button class="btn-next" data-id="next-month">Next</button></caption>';  
  });  
  
  // 拼星期
  html += '<tr>';
  this.createWeekPanel(function( value ) {
    html += '<th>' + value + '</th>';
  });
  html += '</tr>';
  
  this.createGrid(function(data) {
    var index = data.index;
    var title = [ data.year, data.month + 1, data.day ].join('-');
    var current = data.current;
    if ( index % 7 === 0 ) {
      html += '<tr>'
    }
    html += '<td class="' + ( current ? '' : 'not-current-month' ) + '" title="' + title + '">' + data.day + '</td>';
    if ( index % 7 === 6 ) {
      html += '</tr>';
    }
  });

  html += '</table>';
  return html;
};

function calc( year, month, day ) {
  if ( month > 11 ) {
    ++year;
    month = 0;
  } else if ( month < 0 ) {
    --year;
    month = 11;
  }
  var days = getDaysInMonth( year, month );
  day = day == null ? 1 : day <= days ? day : days;
  return new Date( [year, month + 1, day].join('/') );
}

calendar.prototype.nextMonth = function() {
  var date = this.date;
  this.date = calc( date.getFullYear(), date.getMonth() + 1, date.getDate() );
  this.render();
};

calendar.prototype.prevMonth = function() {
  var date = this.date;
  this.date = calc( date.getFullYear(), date.getMonth() - 1, date.getDate() );
  this.render();
};

calendar.prototype.nextYear = function() {
  var date = this.date;
  this.date = calc( date.getFullYear() + 1, date.getMonth(), date.getDate() );
  this.render();
};

calendar.prototype.prevYear = function() {
  var date = this.date;
  this.date = calc( date.getFullYear() - 1, date.getMonth(), date.getDate() );
  this.render();
};

calendar.prototype.init = function() {
  var self = this;
  this.box.onclick = function( e ) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var id = target.getAttribute( 'data-id' );
    switch( id ) {
      case 'next-month':
        self.nextMonth();
        break;
      case 'next-year':
        self.nextYear();
        break;
      case 'prev-month':
        self.prevMonth();
        break;
      case 'prev-year':
        self.prevYear();
        break;
      default:
        break;
    }
  };
};

calendar.prototype.render = function() {
  var html = this._render();
  if ( this.box ) {
    this.box.innerHTML = html;
  } else {
    return html;
  }
  return this;
};

})( this );


var c = calendar({
  box: document.getElementById('box')
});

