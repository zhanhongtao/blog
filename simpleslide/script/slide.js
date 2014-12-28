;(function( global ) {
  function extend( a ) {
    var argus = [].slice.call( arguments, 1 );
    for ( var i = 0, l = argus.length; i < l; ++i ) {
      var item = argus[i];
      for ( var k in item ) {
        if ( item.hasOwnProperty(k) ) {
          a[k] = item[k];
        }
      }
    }
    return a;
  }

  function fixIndex( index, config ) {
    var max = config.max, rotate = config.rotate,
        per = config.per, stop = config.stop;
    index = rotate ? ( index % max + max ) % max :
      index >= max ? max - 1 : index < 0 ? 0 : index;
    return stop ? ( index + per >= max ? max - per : index ) : index;
  }

  // 全局对象.
  var slide = global.slide = function( config ) {
    if ( !(this instanceof slide) ) return new slide( config );
    var config = this.config = extend( {}, slide.default_config, config );
    this.index = config.index;
    this.playing = !!config.auto;
    this.onchange = config.onchange;
    this.init();
  };

  slide.default_config = {
    index: 0,               // 默认索引
    max: 5,                 // 屏个数
    rotate: true,           // 是否 rotate
    auto: false,            // 是否自动切换
    timeout: 3,             // 自动切换时, 时间间隔
    per: 1,                 // 每屏显示个数
    step: 1,                // 每次切换步长 - @NOTE: 显示个数可能会和步长不同
    stop: true              // 不够 per 显示时, stop 处理.
  };

  slide.prototype.update = function( config ) {
    this.config = extend( {}, this.config, config );
  };

  // 初始化.
  slide.prototype.init = function() {
    this.go( this.index );
  };

  // 跳转到 number 屏.
  slide.prototype.go = function( to, from ) {
    if ( to == null ) return this;
    from = from == null ? this.index : from;
    var config = this.config;
    this.index = fixIndex( to, config );
    if ( this.timer ) clearTimeout( this.timer );
    if ( typeof this.onchange === 'function' ) this.onchange.call( this, this.index, from, to );
    if ( this.playing ) {
      var self = this;
      this.timer = setTimeout( function(){
        self.next();
      }, config.timeout * 1000 );
    }
    return this;
  };

  // 下一屏.
  slide.prototype.next = function() {
    return this.go( this.index + this.config.step, this.index );
  };

  // 上一屏.
  slide.prototype.prev = function() {
    return this.go( this.index - this.config.step, this.index );
  };

  // 停止自动切屏.
  slide.prototype.pause = function() {
    this.playing = false;
    if ( this.timer ) {
      clearTimeout( this.timer ), this.timer = null;
    }
    return this;
  };

  // 继续自动切屏.
  slide.prototype.resume = function() {
    var self = this, config = this.config;
    this.playing = true;
    this.timer = setTimeout( function(){
      self.next();
    }, config.timeout * 1000 );
    return this;
  };

})( this );