;(function( global, undefined ) {

var timerList = [], 
  TimerManager = {},
  id = 0, 
  _false = {}, 
  each = function( array, callback ) {
    for ( var i = 0, l = array.length; i < l; ++i ) {
      if ( callback( array[i], i, array ) === _false ) return;
    }
  };
var TT = function( config ) {
  this.id = ++id;
  config = config || {};
  this.timer = null;
  this.time = 0; 
  // 一轮时长 - 秒.
  this.timeout = ( config.timeout || 1 ) * 1000;
  // setInterval 时长 - 豪秒.
  this.min = config.min || 100;
  // 过程中的回调函数 - 返回进度.
  this.progress = config.progress || function() {};
  this.once = config.once === false ? false : true;
  this.init();
};
TT.prototype.init = function() {
  var self = this;
  var min = this.min;
  var progress = this.progress;
  this.timer = setInterval(function() {
    var time = self.time = self.time + min;
    progress( Math.min(1, time/self.timeout) );
    if ( time >= self.timeout ) {
      self.time = 0;
      if ( self.once ) {
        self.pause();
      }
    }
  }, min);
};
// 暂停 - 不会清除已记录时长.
TT.prototype.pause = function() {
  if ( this.timer ) {
    clearInterval( this.timer );
    this.timer = null;
  }
};
// flag: {Boolean} 是否从 0 开始.
TT.prototype.resume = function( flag ) {
  if ( this.timer ) this.pause();
  if ( flag ) this.time = 0;
  this.init();
};
// 全局 Timer 管理.
var Timer = global.Timer = {};
Timer.add = function( config ) {
  var timer = new TT( config );
  timerList.push( timer );
  return TimerManager[ timer.id ] = timer;
};
Timer.pause = function(id) {
  var list = id != undefined ? [ TimerManager[id] ] : timerList;
  each( list, function( timer ) { timer && timer.pause(); });
};
Timer.resume = function( id, flag ) {
  var list = flag == undefined ? timerList : [ TimerManager[id] ];
  flag = flag == undefined ? id : flag;
  each( list, function( timer ) { timer && timer.resume( flag ); });
};

})( this );
