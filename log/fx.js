
;(function( root ) {

function FX( duration, callback, useStep ) {
  if ( !(this instanceof FX) ) {
    return new FX(duration, callback, useStep);
  }
  this.interval = 16;

  this.duration = duration;
  this.useStep = !!useStep;
  this.frames = Math.ceil(this.duration / this.interval);
  this.frame = 0;
  this.fixed = 0;
  this.status = '';
  this.startTimeStamp = 0;

  this.callback = function( per ) {
    if ( per == 1 ) {
      this.startTimeStamp = 0;
      this.status = '';
      this.fixed = 0;
    }
    callback(per);
  };
  this.start();
}

function step( time ) {
  if ( this.useStep ) {
    per = Math.min(1, ++this.frame / this.frames);
  } else {
    per = Math.min(1, (now() - time) / this.duration);
  }
  if ( per == 1 ) {
    clearInterval( this._timer );
  }
  this.callback( per );
}

function now() {
  return (new Date).getTime();
}

FX.prototype.start = function() {
  if ( this.status == '' ) {
    this.startTimeStamp = now();
  }
  var time = now();
  if ( this.status != '' ) {
    time = this.startTimeStamp + this.fixed;
  }
  this.status = 'playing';
  var self = this;
  this._timer = setInterval(function() {
    step.call(self, time);
  }, this.interval );
  return this;
};

FX.prototype.pause = function( toEnd ) {
  this.status = 'pause';
  this._stop = now();
  clearInterval( this._timer );
  if ( toEnd ) {
    this.callback(1);
  }
  return this;
};

FX.prototype.resume = function() {
  if ( this.status == 'pause' ) {
    this.fixed += now() - this._stop;
  }
  return this.start();
};

root.FX = FX;

})( this );

