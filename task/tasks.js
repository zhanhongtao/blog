function Tasks() {
  this.tasks = [];
  // 新建任务时, 是否自动启动
  this.auto = true;
  // 同时可执行多少任务
  this.maxDoingTasks = 5;
  this.doingTasksCount = 0;
  this.doTasksCount = 0;
  var l = new Light;
  this.on = this.listen = l.listen.bind(l);
  this.notify = l.notify.bind(l);
}

Tasks.fn = Tasks.prototype;

Tasks.fn.doNextTask = function() {
  // 0. 是否有任务
  // 1. 是否全部都结束.
  // 2. 是否应该进行下一个任务
  var tasks = this.tasks;
  if (tasks.length === 0) return this;
  var finished = true;
  this.do(function(task) {
    switch (task.state) {
      case 0:
      case 1:
      case 2:
        finished = false;
        break;
      case 3:
      case 4:
        break;
      case 5:
        if (this.doingTasksCount < this.maxDoingTasks) {
          this.start(task);
        }
        return finished = false;
    }
  });
  if (finished) {
    this.notify('tasks-done');
  }
};

Tasks.fn.add = function(task) {
  this.tasks.push(task);
  this.notify('task-init', task);
  var self = this;
  task.on('progress', function() {
    self.notify('task-progress', task);
  });
  task.on('done', function() {
    self.notify('task-done', task);
    --self.doingTasksCount;
    --self.doTasksCount;
    self.doNextTask();
  });
  task.on('fail', function() {
    self.notify('task-fail', task);
    --self.doingTasksCount;
    --self.doTasksCount;
    self.doNextTask();
  });
  if (this.auto) {
    this.start(task);
  }
  return this;
};

Tasks.fn.start = function(task) {
  var wait = this.doingTasksCount >= this.maxDoingTasks;
  if (!wait) ++this.doingTasksCount;
  ++this.doTasksCount;
  task.start(wait);
  return this;
};

Tasks.fn.remove = function(task) {
  return this.do(function(item, index) {
    if (task !== item) return;
    this.tasks.splice(index, 1);
    this.notify('task-remove', task);
    var state = task.state;
    if (state === 1) {
      --this.doingTasksCount;
      this.doNextTask();
    } else if (state === 5) {
      --this.doTasksCount;
    }
    return false;
  });
};

Tasks.fn.pause = function(task) {
  if (task.state === 1 || task.state === 5) {
    task.pause();
    --this.doingTasksCount;
    --this.doTasksCount;
    this.doNextTask();
  }
  return this;
};

Tasks.fn.resume = function(task) {
  var wait = this.doingTasksCount >= this.maxDoingTasks;
  var state = task.state;
  if (!wait && state === 2) {
    ++this.doingTasksCount;
    ++this.doTasksCount;
    task.resume();
  }
  return this;
};

Tasks.fn.removeAll = function() {
  this.doingTasksCount = this.doTasksCount = 0;
  return this.tasks = [], this;
};

Tasks.fn.pauseAll = function() {
  return this.do(function(task) {
    task.pause();
  });
};

Tasks.fn.resumeAll = function() {
  return this.do(function(task) {
    this.resume(task);
  });
};

Tasks.fn.startAll = function() {
  return this.do(function(task) {
    task.start();
  });
};

Tasks.fn.do = function(handle) {
  var tasks = this.tasks;
  for (var i = 0, l = tasks.length, task; i < l; ++i) {
    if (handle.call(this, tasks[i], i) === false) break;
  }
  return this;
};

Tasks.fn.get = function(id) {
  if (id) {
    var ret;
    this.do(function(task) {
      if (task.id === id) {
        ret = task;
        return false;
      }
    });
    return ret;
  } else {
    return this.tasks;
  }
};
