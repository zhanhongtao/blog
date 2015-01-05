;(function(root) {

// @todo: 已到类里面
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

function noop() {}

// 处理单个格子样式.
function grid(data) {
  var config = this.config;
  var list = [config.item];
  var classes = config.classes;
  for ( var key in classes ) {
    if ( classes.hasOwnProperty(key) ) {
      var value = classes[key].call(this, data);
      if (typeof value == 'string') {
        list.push(value);
      }
    }
  }
  return '<div class="' + list.join(' ') + '">' + data.day + '</div>';
}

// 修正星期显示
// start: 认为周几算第一天(0 表示周日)
// weekTextList: 星期对应文案
function fixedWeekList(start, weekTextList) {
  while( start-- > 0 ) {
    weekTextList.push( weekTextList.shift() );
  }
}

// 修正星期索引
function fixedWeek(week) {
  return (7 + week % 7) % 7;
}

// 第一天是星期几
// day: 任意某一天
// week: day 对应的星期
function firstDayOfDate(day, week) {
  day = day % 7;
  while (day > 1) {
    --week;
    --day;
  }
  return (7 + week % 7) % 7;
  // 或
  // return new Date( year, month, 1 ).getDay();
}

// 是否为闰年
function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

// 指定年月, 计算当前月有多少天
function getDaysInMonth(year, month) {
  var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // 对 2 月份特殊处理
  return month === 1 && isLeapYear(year) ? 29 : days[month];;
  // 或者
  // return new Date( year, month, 0 ).getDate();
}

// date 是否在给定的range([min, max])区间内
function inRange(date, range) {
  var min = range[0], max = range[1];
  if ( !min && !max ) return true;
  var bottom = new Date(min).getTime();
  date = date instanceof Date ? date : new Date(date);
  var test = date.getTime();
  if (!max) return test >= bottom;
  var top = new Date(max).getTime();
  return test >= bottom && test <= top;
}

// @NOTE: 只修正一个值.
function calc(obj) {
  var year = obj.year, month = obj.month, day = obj.day;
  var days = getDaysInMonth(year, month);
  if (day > days) {
    ++month;
  } else if (day < 1) {
    --month;
  }
  if (month > 11) {
    ++year;
    month = 0;
  } else if (month < 0) {
    --year;
    month = 11;
  }
  var days = getDaysInMonth(year, month);
  obj.year = year, obj.month = month, obj.day = day <= days ? day : days;
  return obj;
}

// @todo: 支持 format 参数.
function toString(obj, format) {
  var value = [obj.getFullYear(), obj.getMonth() + 1, obj.getDate()].join('-');
  return value;
}

// 对外公布接口
root.calendar = calendar;

// 默认配置
calendar.defaultConfig = {
  // 单个 grid 的 className
  item: 'item',
  // 是否渲染 week 投信息
  noweek: false,
  // 星期规则
  // 认为从星期几开始显示
  // 其中, 0 表示周日
  start: 0,
  today: new Date,
  onclick: noop,
  // 星期显示文本
  weekTextList: weekTextList,
  // 样式规则.
  classes: {
    // 当天
    today: function(data) {
      var today = this.today;
      if (
        today.getFullYear() == data.year &&
        today.getMonth() == data.month &&
        today.getDate() == data.day
      ) {
        return 'today';
      }
    },
    // 非当月天
    notInMonth: function(data) {
      if (!data.current) {
        return 'not-current-month';
      }
    },
    // 周末
    weekend: function(data) {
      if (data.week == 0 || data.week == 6) {
        return 'weekend';
      }
    },
    // 范围
    disabled: function(data) {
      if (!inRange(
        new Date( data.year, data.month, data.day ),
        [this.min, this.max]
      )) {
        return 'disabled';
      }
    },
    // 选中样式
    selected: function(data) {
      if (this.selected) {
        for (var i = 0, l = this.selected.length; i < l; ++i) {
          var tmp = this.selected[i];
          if ( tmp == [data.year, data.month + 1, data.day].join('-') ) {
            return 'selected';
          }
        }
      }
    },
    // 其他月, 相同日期
    sameday: function(data) {
      var day = this.today.getDate();
      var string = toString(this.today);
      var tmp = [data.year, data.month + 1, data.day].join('-');
      if (data.day == day && tmp != string) {
        return 'sameday';
      }
    }
  }
};

// 方便重写 render 方法.
calendar.util = {
  firstDayOfDate: firstDayOfDate,
  isLeapYear: isLeapYear,
  fixedWeek: fixedWeek,
  getDaysInMonth: getDaysInMonth,
  inRange: inRange,
  calc: calc
};

function calendar(config) {
  if (
    !(this instanceof calendar)
  ) {
    return new calendar(config);
  }

  // 合并 config
  var config = $.extend({}, calendar.defaultConfig, config);
  this.config = config;

  // 调整 week 的文案顺序
  var start = this.start = config.start;
  fixedWeekList(start, config.weekTextList);

  // 记录今天的日期
  this.today = config.today;

  // 记录当前日期
  // 一般和 today 同步
  // 默认: today
  var date = this.today;
  if (config.date) {
    if (typeof config.date == 'string') {
      date = new Date(config.date);
    } else if (config.date instanceof Date) {
      date = config.date;
    }
  }
  this.date = date;

  // 高亮当前日期
  this.selected = [ toString(this.date) ];

  // 记录容器
  this.box = config.box;

  // 初始化
  // 渲染页面
  this.init();
}

calendar.prototype.init = function() {
  this.render();
  var onclick = this.config.click;
  var self = this;
  $(this.box).on('click', 'td', function(e) {
    // @todo: 使用 shift/ctrl 做区间选择
    var value = $(this).data('date');
    var date = new Date(value);
    var ret = onclick.call(self, date);
    if (ret !== false) {
      self.selected = [value];
    }
  });
  return this;
};

// @todo: 支持重新定义 render
calendar.prototype.render = function() {
  var config = this.config,
      self = this,
      html = '';

  if (!config.noweek) {
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
  for (var i = 0; i < 7; ++i) {
    html += '<th>' + weekTextList[i] + '</th>';
  }
  html += '</tr>';

  // 拼格子
  var config = this.config, self = this;
  this.grid(function(data) {
    var index = data.index;
    if (index % 7 === 0) {
      html += '<tr>'
    }
    var date = [data.year, data.month + 1, data.day ].join('-');
    html += '<td data-date="' + date + '" data-week="' + data.week + '">';
    html += grid.call(self, data);
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

// 处理单个 grid 显示
calendar.prototype.grid = function(func) {
  var date = this.date;
  var theWeekOfFirstDay = firstDayOfDate( date.getDate(), date.getDay() );
  var index = 0;
  var paddingDays = (7 - this.start + theWeekOfFirstDay) % 7;
  // paddingDays = paddingDays == 0 ? 7 : paddingDays;

  // @todo.
  // 初始化
  // 记录当前屏, 显示的日期
  this.views = this.views || [];
  this.views.length = 0;

  // 需要补充格子 - 上个月日期
  if (paddingDays) {
    var _date = calc({
        year: date.getFullYear(),
        month: date.getMonth() - 1,
        day: date.getDate()
      }),
      days = getDaysInMonth(_date.year, _date.month) - paddingDays,
      week = this.start;
    while(paddingDays > 0) {
      func({
        year: _date.year,
        month: _date.month,
        day: ++days,
        week: fixedWeek(week++),
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
      index: index++,
      current: true
    });
  }

  // 补充格子 - 下个月.
  // 28, 29, 30, 31 => +6 => 7 * 6
  var alldays = 5 * 7;
  if ( index <= alldays ) {
    var _date = calc({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }),
      i = 1;
    while (index < alldays) {
      func({
        year: _date.year,
        month: _date.month,
        day: i++,
        week: fixedWeek(week++),
        index: index++,
        current: false
      });
    }
  }
};

/*
  nextYear/nextMonth
  prevYear/prevMonth
  只更新数据, 不负责渲染
*/
$.each(['next', 'prev'], function(i, prefix) {
  $.each(['year', 'month'], function(j, type) {
    var _type = type.charAt(0).toUpperCase() + type.slice(1);
    calendar.prototype[ prefix + _type ] = function() {
      var date = this.date, obj = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      };
      obj[type] = obj[type] + (prefix == 'next' ? 1 : -1);
      obj = calc(obj, type);
      this.date = new Date( [obj.year, obj.month + 1, obj.day].join('/') );
    };
  });
});

calendar.prototype.gototoday = function() {
  this.date = this.config.today;
  return this.render();
};

calendar.prototype.get = function() {
  return this.selected;
};

})( this );
