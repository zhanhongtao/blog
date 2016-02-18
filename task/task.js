function createTaskId() {
  return ('' + Math.random()).slice(2, 8) + '-' + Date.now();
}

function Task(task) {
  this.id = createTaskId();
  this.task = task;
  // 注册时间
  this.regTime = Date.now();
  // 任务已进行多久
  this.usedTime = 0;
  // 任务开始时间
  this.startTime = 0;
  // 任务状态
  // 0: init
  // 1: progress
  // 2: pause
  // 3: done
  // 4: error
  // 5: wait
  this.state = 0;

  var l = new Light;
  this.on = this.listen = l.listen.bind(l);
  this.notify = l.notify.bind(l);

  this.init();
}

Task.fn = Task.prototype;
Task.fn.on = Task.fn.listen;

function done() {
  this.state = 3;
  this.usedTime = Date.now() - this.startTime;
  this.notify('done');
}

function fail() {
  this.state = 4;
  this.usedTime = Date.now() - this.startTime;
  this.notify('fail');
}

function progress() {
  this.notify('progress');
}

Task.fn.init = function() {
  this.task.on('progress', progress.bind(this));
  this.task.on('done', done.bind(this));
  this.task.on('fail', fail.bind(this));
};

Task.fn.start = function(wait) {
  if (wait) {
    this.state = 5;
  } else if (this.state == 0 || this.state == 5) {
    this.state = 1;
    this.task.start();
    this.notify('start');
    this.startTime = Date.now();
  } else if (this.state === 2) {
    this.resume();
  }
  return this;
};

Task.fn.pause = function() {
  var state = this.state;
  if (state === 1 || state === 5) {
    this.state = 2;
    this.usedTime = Date.now() - this.startTime;
    this.task.pause();
    this.notify('pause');
  }
  return this;
};

Task.fn.resume = function() {
  if (this.state === 2) {
    this.state = 1;
    this.startTime = Date.now();
    this.task.resume();
    this.notify('resume');
  }
  return this;
};
