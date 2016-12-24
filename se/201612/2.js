// api
function get() {
  var n = parseInt('111111', 2);
  return Math.floor(Math.random() * (n + 1));
}

var keymap = {
  weibo: 0,
  qzone: 1,
  wechat: 2,
  tcweibo: 3,
  wechatfriend: 4,
  qq: 5
};

// 定义业务中显示顺序
var list = [
  {key: 'wechat', title: '微信'},
  {key: 'wechatfriend', title: '微信朋友圈'},
  {key: 'weibo', title: '微博'},
  {key: 'qq', title: 'QQ'},
  {key: 'qzone', title: 'QQ 空间'}
];

var n = get();
var bit = n.toString(2);

list.forEach(item => {
  let i = keymap[item.key];
  let status = ((1 << i) & n) === 0 ? 0 : 1;
  console.log(bit, i, status, item.key);
});

