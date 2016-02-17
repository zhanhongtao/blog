function task(n, t) {
  if (!(this instanceof task)) {
    return new task(n, t);
  }
  this.timer;
  this.count = n;
  this.current = 0;
  this.t = t || 1000;
  var l = new Light;
  this.on = this.listen = l.listen.bind(l);
  this.notify = l.notify.bind(l);
}

task.prototype = new Light;

task.fn = task.prototype;

task.fn.do = function() {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  var self = this;
  this.timer = setTimeout(function() {
    ++self.current;
    self.notify('progress');
    if (self.current >= self.count) {
      self.current = self.count;
      self.notify('done'); // Math.random() > 0.85 ? 'done' : 'fail');
      return;
    }
    self.do();
  }, this.t)
};

task.fn.start = function() {
  this.do();
};

task.fn.pause = function() {
  if (this.timer) {
    clearTimeout(this.timer);
    this.timer = null;
  }
};

task.fn.resume = function() {
  this.do();
};
