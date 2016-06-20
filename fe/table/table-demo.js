var config = {
  editable: true,
  vector: [{
    key: 'color',
    name: '颜色',
    value: ['红色', '蓝色', '黑色']
  }, {
    key: 'size',
    name: '尺寸',
    value: [20, 30, 40, 50]
  }, {
    key: 'function',
    name: '功能',
    value: ['a', 'b', 'c']
  }],
  other: [{
    key: 'price',
    name: '价格',
  }, {
    key: 'id',
    name: '唯一 ID'
  }],
  grid: function(value) {
    return '<input value="' + value + '" />';
  }
};

var db = [{
  color: '红色',
  size: 30,
  function: 'a',
  price: 1000,
  id: 'hehe'
}];

try {
  db = JSON.parse(localStorage.table);
} catch(e) {}

var node = document.querySelector('#table');
var table = new X(config, db, node);
table.render();

