
;(function( root ) {

var weekTextList = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日',
];

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

var calendar = root.calendar = function( config ) {
  if ( !(this instanceof calendar) ) {
    return new calendar( config );
  }
  this.date = config.date ? new Date( config.date ) : new Date;
  this.box = config.box;
  // 认为周日是第一天.
  this.start = 1;
  fixedWeekList( this.start );
  this.init();
  this.render();
};

// 方便重写 render 方法.
calendar.util = {
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  getDaysInMonth: getDaysInMonth,
  weekTextList: weekTextList
};

calendar.prototype._render = function() {
  var date = this.date;
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var week = date.getDay();

  var html = '';
  html += '<table>'
  html += '<caption class="clearfix"><button class="btn-prev" data-id="prev-month">Previous</button>';
  html += [year, month + 1].join('/');
  html += '<button class="btn-next" data-id="next-month">Next</button></caption>';
  
  // 生成 head 部分
  html += '<tr>';
  for ( var i = 0; i < 7; ++i ) {
    html += '<th>' + weekTextList[i] + '</th>';
  }
  html += '</tr>';
  
  var i = 1, j,
    havePadding = false,
    week = firstDayOfDate( day, week ),
    days = getDaysInMonth( year, month );
  // 确认当月第一天是周几, 然后补充多少个格子.
  week = this.start === 0 ? week: week - 1;
  // 生成表格部分
  while( i <= days ) {
    j = 0;
    html += '<tr>';
    if ( havePadding == false ) {
      havePadding = true;
      // 不提前加一, 方便下面条件判断
      while ( j < week ) {
        html += '<td></td>';
        ++j;
      }
    }
    while ( j++ < 7 && i <= days ) {
      html += '<td class="' + (i === day ? 'current' : '') + '">' + (i) + '</td>';
      ++i;
    }
    html += '</tr>';   
  }

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
  day = day <= days ? day : days;
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

