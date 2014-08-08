;(function( global ) {

  // 空函数.
  function noop() {};

  // 合并对象.
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

  // 修正索引.
  function fixIndex( index, max, rotate ) {
    return rotate ?
        ( index % max + max ) % max :
      index >= max ? max - 1 :
        index < 0 ? 0 : index;
  }


  // 全局对象.
  var slide = global.slide = function( config ) {
    if ( !(this instanceof slide) ) {
      return new slide( config );
    }
    var config = this.config = extend( {}, slide.default_config, config );
    this.index = config.index;
    this.onchange = config.onchange;
    this.playing = !!config.auto;
    this.init();
  };

  // 默认配置.
  slide.default_config = {
    index: 0,
    max: 5,
    rotate: true,
    auto: false,
    timeout: 3
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
    this.index = fixIndex( to, config.max, config.rotate );
    if ( this.timer ) clearTimeout( this.timer );
    if ( typeof this.onchange === 'function' ) this.onchange( this.index, from, to );
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
    return this.go( this.index + 1, this.index );
  };

  // 上一屏.
  slide.prototype.prev = function() {
    return this.go( this.index - 1, this.index );
  };

  // 取/设置配置信息.
  slide.prototype.config = function( config ) {
    return config ? extend( this.config, config ) : this.config;
  };
 
  // 停止自动切屏.
  slide.prototype.pause = function() {
    this.playing = false;
    return this;
  };
 
  // 继续自动切屏.
  slide.prototype.resume = function() {
    this.playing = true;
    this.next();
    return this;
  };

})( this );
