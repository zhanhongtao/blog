var config = {
  editable: true,
  vector: [
  {
    key: 'hello',
    name: 'Top1',
    value: ['T1', 'T2', 'T3'],
    most: true
  },
  {
    key: 'world',
    name: 'Top2',
    value: ['Tx', 'Ty'],
    most: true
  },
  {
    name: 'Top3',
    value: ['TT'],
    most: true
  },
  {
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
  other: [/*{
    key: 'price',
    name: '价格(元)',
  }, {
    key: 'id',
    name: '唯一 ID'
  }*/],
  grid: function(value) {
    return '<input value="' + value + '" />';
  }
};

config.vector = [
  {
    name: 'top1',
    value: ['t1', 't2', 't3'],
    most: true
  }, {
    name: 'top2',
    value: ['tx', 'ty'],
    most: true
  }, {
    name: 'size',
    value: [60, 65, 70, 80]
  }, {
    name: 'color',
    value: ['red', 'transparent']
  }
];

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

