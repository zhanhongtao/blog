// 模拟数据接口
// 不对数据做检查
var db = [
  {
    id: 1,
    name: '搜索引擎',
    parentId: 0
  },
  {
    id: 2,
    name: '新闻',
    parentId: 0
  },
  {
    id: 3,
    name: 'words',
    parentId: 0
  },
  {
    id: 4,
    name: '百度(www.baidu.com)',
    parentId: 1
  },
  {
    id: 5,
    name: 'Google(google.cn)',
    parentId: 1
  },
  {
    id: 6,
    name: 'sogou(sogou.com)',
    parentId: 1
  },
  {
    id: 7,
    name: 'sohu 新闻',
    parentId: 2
  },
  {
    id: 8,
    name: '网易新闻',
    parentId: 2
  },
  {
    id: 9,
    name: '网络热词',
    parentId: 3
  },
  {
    id: 10,
    name: '呵呵',
    parentId: 9
  },
  {
    id: 11,
    name: 'Hello World.',
    parentId: 9
  }
];

var gid = 1;

$.each(db, function(index, item) {
  if (item.id >= gid) {
    gid = item.id + 1;
  }
});

function getCategoryByParentId(parentId) {
  if (parentId == null) parentId = 0;
  var defer = $.Deferred();
  setTimeout(function() {
    var list = [];
    for (var i = 0, l = db.length; i < l; ++i) {
      var item = db[i];
      if (item && item.parentId === parentId) {
        list.push(item);
      }
    }
    defer.resolve(list);
  }, 200);
  return defer;
}

function addCategory(name, parentId) {
  var defer = $.Deferred();
  db[gid] = {
    name: name,
    parentId: parentId,
    id: gid
  };
  var id = gid++;
  setTimeout(function() {
    defer.resolve(id);
  }, 500);
  return defer;
}

function delCategory(id) {
  var defer = $.Deferred();
  setTimeout(function() {
    for (var i = 0; i < db.length; ++i) {
      var item = db[i];
      if (item && item.id === id) {
        db[i] = item = null;
        break;
      }
    }
    defer.resolve();
  });
  return defer;
}

// 业务代码
var context = $('#category');
var prefix = '#category-';
var selectorControl = '.name';
var selectorLevelItem = '.cx';
var selectorContent = '.bd';
var classSelected = 'selected';
var classloading = 'loading';
var keyParentId = 'parent';
var keyLevel = 'level';
var levels = context.find('>' + selectorLevelItem);

var cache = [];
var maxLevel = 3;
var autoHighlight = true;

function render(tplid, data, node) {
  var tpl = $(tplid).html();
  var html = rt.template(tpl, data);
  $(node).html(html);
}

function add(name, parentId, level) {
  addCategory(name, parentId).done(function(id) {
    var data = {
      id: id,
      parentId: parentId,
      name: name,
      use_sub_tpl: true
    };
    var tpl = $('#tpl-category-item').html();
    var html = rt.template(tpl, data);
    var box = $(levels[level]);
    box.find('.bd ul').append(html);
    box.find(selectorControl).val('');
    if (
      autoHighlight &&
      level < maxLevel - 1
    ) {
      highlight(id);
    }
  });
}

function del(id) {
  delCategory(id);
  var node = $(prefix + id);
  var box = queryBoxById(id);
  var level = box.data(keyLevel);
  node.remove();
  if (
    level < maxLevel - 1 &&
    cache[level] == id
  ) {
    delete cache[level];
    if (autoHighlight) {
      var first = box.find('li:first-child');
      if (first.length) {
        var id = first.data('id');
        highlight(id);
      } else {
        changeControlStatusByLevel(level, true);
        clearBoxByLevel(level);
      }
    } else {
      changeControlStatusByLevel(level, true);
      clearBoxByLevel(level);
    }
  }
  var control = queryControlByLevel(level);
  control.focus();  
}

function queryBoxById(id) {
  return $(prefix + id).closest(selectorLevelItem);
}

function queryControlByLevel(level) {
  return $(levels[level]).find(selectorControl);
}

// toggle class
// queryCategoryByParentId
function highlight(id) {
  var current = context.find(prefix + id);
  var box = queryBoxById(id);
  var level = box.data(keyLevel);
  if (id != cache[level]) {
    cache[level] = id;
    queryCategoryByParentId(id, level + 1);
    current.siblings().removeClass(classSelected);
    current.addClass(classSelected);
  }
}

// 更新 view
function changeViewToLoading(node, loading) {
  node.toggleClass(classloading, !!loading);
  !!loading && node.html('');
}

// 更新 control 状态
function changeControlStatusByLevel(level, disabled, parentId) {
  if (!!disabled) {
    for (++level; level < maxLevel; ++level) {
      var control = $(levels[level]).find(selectorControl);
      control[0].disabled = true;
      control.removeData(keyParentId);
    }
  } else {
    var control = $(levels[level]).find(selectorControl);
    control[0].disabled = false;
    control.data(keyParentId, parentId);
    // control.focus();
  }
}

function clearBoxByLevel(level) {
  for (++level; level < maxLevel; ++level) {
    $(levels[level]).find(selectorContent).html('');
  }
}

function queryCategoryByParentId(parentId, level) {
  changeControlStatusByLevel(level, true);
  clearBoxByLevel(level, true);
  var box = $(levels[level]);
  var node = box.find(selectorContent);
  changeViewToLoading(node, true);
  getCategoryByParentId(parentId).done(function(list) {
    render('#tpl-category-list', list, node);
    changeControlStatusByLevel(level, false, parentId);
    if (
      autoHighlight &&
      list.length > 0 &&
      level < maxLevel - 1
    ) {
      var first = list[0];
      highlight(first.id);
    }
  }).always(function() {
    changeViewToLoading(node, false);
  });
}

queryCategoryByParentId(0, 0);

context.on('submit', 'form', function(e) {
  e.preventDefault();
  var level = $(this).closest(selectorLevelItem).data(keyLevel);
  var node = $(this).find(selectorControl);
  var name = $.trim(node.val());
  if (name) {
    var parentId = node.data(keyParentId);
    add(name, parentId, level);
  }
});

context.on('click', '.del-category-item', function(e) {
  e.preventDefault();
  e.stopPropagation();
  var id = $(this).data('id');
  del(id);
});

context.on('click', '#c0 li, #c1 li', function(e) {
  var id = $(this).data('id');
  highlight(id);
});
