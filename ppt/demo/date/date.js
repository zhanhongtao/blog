
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
  week = week === 0 ? 7 : week;
  day = day % 7;
  while ( day ) {
    --week;
    --day;
  }
  return ( 8 + week % 8 ) % 8;
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
  // @todo: 缓存初始化数据.
  var date = this.date = new Date();
  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.day = date.getDate();
  this.week = date.getDay();
  // 认为周日是第一天.
  this.start = 0;
  fixedWeekList( this.start );
};

// 方便重写 render 方法.
calendar.util = {
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  getDaysInMonth: getDaysInMonth,
  weekTextList: weekTextList
};

calendar.prototype.render = function() {
  var html = '<table>'
  // 生成 head 部分
  html += '<tr>';
  for ( var i = 0; i < 7; ++i ) {
    html += '<th>' + weekTextList[i] + '</th>';
  }
  html += '</tr>';
  
  var i = 1, j,
    havePadding = false,
    week = firstDayOfDate( this.day, this.week ),
    days = getDaysInMonth( this.year, this.month );
  
  // 确认当月第一天是周几, 然后补充多少个格子.
  week = this.start === 0 ? week : week - 1;
  // 生成表格部分
  while( i <= days ) {
    j = 0;
    html += '<tr>';
    if ( havePadding == false ) {
      havePadding = true;
      // 不提前加一, 方便下面条件判断
      while ( j < week ) {
        console.count( 'week' );
        html += '<td></td>';
        ++j;
      }
    }
    while ( j++ < 7 && i <= days ) {
      html += '<td>' + (i++) + '</td>';
    }
    html += '</tr>';   
  }

  html += '</table>';
  return html;
};

// 下一月
calendar.prototype.nextMonth = function() {

};

// 下一年
calendar.prototype.nextYear = function() {

};

})( this );



var c = calendar();
var html = c.render();
document.getElementById( 'box' ).innerHTML = html;
