function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function initTask() {
  var time = random(500, 2000);
  var count = random(10, 50);
  var item = new Task(task(count, time));
  item.title = 'Task-' + Date.now();
  item.progress = 0;
  return item;
}

var tt = new Tasks();

var app = new Vue({
  el: '#box',
  data: {
    states: [
      'Pending', // start
      'Loading', // pause
      'Pause', // resume
      'Done',
      'Fail',
      'Waiting'
    ],
    actions: [
      ['start', '开始'],
      ['pause', '暂停'],
      ['resume', '继续']
    ],
    selected: [],
    auto: tt.auto,
    tasks: tt.get()
  },
  computed: {
    haveTasksInit: function() {
      return this.selected.some(function(id) {
        var task = tt.get(id);
        return task.state === 0;
      });
    },
    haveTasksRun: function() {
      return this.selected.some(function(id) {
        var task = tt.get(id);
        return task.state === 1;
      });
    },
    haveTasksPause: function() {
      return this.selected.some(function(id) {
        var task = tt.get(id);
        return task.state === 2;
      });
    },
    haveTasks: function() {
      return !!this.selected.length;
    }
  },
  methods: {
    addTask: function() {
      tt.add(initTask());
    },
    doAction: function(action) {
      this.selected.forEach(function(id) {
        var task = tt.get(id);
        tt[action](task);
      });
      this.selected = [];
    },
    toggleTaskAutoStart: function() {
      tt.auto = !tt.auto;
      this.auto = !this.auto;
    }
  }
});

tt.listen('task-progress', function(item) {
  var task = item.task;
  item.progress = Math.floor(task.current / task.count * 10000) / 100;
});

tt.listen('task-remove', function(task) {
  app.tasks.$remove(task);
});

// @todo.
tt.listen('tasks-done', function() {
  console.log('tasks-done');
});

tt.listen('tasks-fail', function() {
  console.log('tasks-fail');
});

// 初始化任务
for (var i = 0; i < 5; ++i) {
  app.addTask();
}
