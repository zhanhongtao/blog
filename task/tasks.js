function Tasks() {
  this.tasks = {};
  this.auto = false;

  var l = new Light;
  this.on = this.listen = l.listen.bind(l);
  this.notify = l.notify.bind(l);
}

Tasks.fn = Tasks.prototype;

Tasks.fn.check = function() {
  var finish = true, active = false;
  for (var id in this.tasks) {
    active = true;
    var task = this.tasks[id];
    if (task.state != 3) {
      finish = false;
      break;
    }
  }
  if (finish && active) {
    this.notify('tasks-done');
  }
};

Tasks.fn.add = function(task) {
  this.tasks[task.id] = task;
  this.notify('task-init', task);
  var self = this;
  task.on('progress', function() {
    self.notify('task-progress', task);
  });
  task.on('done', function() {
    self.notify('task-done', task);
    self.check();
  });
  task.on('fail', function() {
    self.notify('task-fail', task);
    self.check();
  });
  if (this.auto) {
    this.start(task.id);
  }
};

Tasks.fn.start = function(id) {
  var task = this.tasks[id];
  task.start();
  this.notify('task-start', task);
};

Tasks.fn.remove = function(id) {
  var task = this.tasks[id];
  delete this.tasks[id];
  this.check();
  this.notify('task-remove', task);
};

Tasks.fn.pause = function(id) {
  var task = this.tasks[id];
  task.pause();
  this.check();
  this.notify('task-pause', task);
};

Tasks.fn.resume = function(id) {
  var task = this.tasks[id];
  task.resume();
  this.notify('task-resume', task);
};

Tasks.fn.removeAll = function() {
  for (var id in this.tasks) {
    this.remove(id);
  }
};

Tasks.fn.pauseAll = function() {
  for (var id in this.tasks) {
    this.pause(id);
  }
};

Tasks.fn.resumeAll = function() {
  for (var id in this.tasks) {
    this.resume(id);
  }
};
