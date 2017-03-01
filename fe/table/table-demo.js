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

config.vector = [
  {
    name: 'top1',
    values: ['topa', 'topb', 'topc', 'topc'],
    most: true
  }, {
    name: 'top2',
    values: ['topx', 'topy', 'topz']
  }, {
    name: 'size',
    values: ['s1', 's2']
  }, {
    name: 'color',
    values: ['c']
  }
];

var db = [
  {
    vector: {
      top1: 'topb',
      top2: 'topx',
      size: 's1',
      color: 'c'
    },
    price: 1000,
    id: 'hehe'
  },
  {
    vector: {
      top1: 'topa',
      top2: 'topx',
      size: 's1',
      color: 'c'
    },
    price: 1000,
    id: 'hehe'
  },
  {
    vector: {
      top1: 'topa',
      top2: 'topx',
      size: 's2',
      color: 'c'
    },
    price: 1000,
    id: 'hehe'
  },
  {
    vector: {
      top1: 'topb',
      top2: 'topx',
      size: 's1',
      color: 'c'
    },
    price: 1000,
    id: 'hehe'
  }
]

try {
  db = JSON.parse(localStorage.table);
} catch(e) {}

var node = document.querySelector('#table');
var table = new Table(config, db, node);
table.render();

// table.update('price', '100')

if (table.isEmpty('id')) {
  var list = []
  var i = 0
  while (i < 36) {
    list.push(i++)
  }
  table.update('id', list)
}