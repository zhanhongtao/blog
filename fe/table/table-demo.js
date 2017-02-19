var config = {
  editable: true,
  multiple: true,
  classname: 'update',
  vector: [
    {
      key: 'branchid',
      values: [1, 2],
      name: '店铺名称',
      texts: ['share1', 'share2'],
      most: true
    },
    {
      key: 'hello',
      name: 'Top1',
      values: ['T1', 'T2', 'T3'],
      most: true
    },
    {
      name: '颜色',
      values: ['红色', '蓝色', '黑色']
    }, {
      name: '尺寸',
      values: [20, 30, 40, 50]
    }, {
      name: '功能',
      values: ['a', 'b', 'c'],
      most: true
    }
  ],
  other: [
    {
      key: 'price',
      name: '价格(元)'
    }, {
      key: 'id',
      name: '唯一 ID'
    }
  ],
  grid: function (value) {
    return '<input value="' + value + '" />'
  }
}

/*
config.vector = [
  {
    name: 'top1',
    values: ['t1', 't2', 't3'],
    most: true
  }, {
    name: 'top2',
    values: ['tx', 'ty']
  }, {
    name: 'size',
    values: [60, 65, 70, 80]
  }, {
    name: 'color',
    values: ['red', 'transparent']
  }
];
*/

var db = [
  {
    vector: {
      '颜色': '红色',
      '尺寸': 30,
      '功能': 'a'
    },
    price: 1000,
    id: 'hehe'
  }
];

try {
  db = JSON.parse(localStorage.table);
} catch(e) {}

var node = document.querySelector('#table');
var table = new Table(config, db, node);
table.render();

table.update('price', '100')

if (table.isEmpty('id')) {
  var list = []
  var i = 0
  while (i < 36) {
    list.push(i++)
  }
  table.update('id', list)
}