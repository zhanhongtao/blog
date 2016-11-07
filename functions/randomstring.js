function getRandomString(prefix) {
  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }

  if (typeof prefix !== 'string') {
    prefix = '__';
  }

  var base = [];
  for(var i = 0; i < 26; i++) {
    base.push(String.fromCharCode(65+i));
    base.push(String.fromCharCode(97+i));
    if(i < 10) {
      base.push(String.fromCharCode(48+i));
    }
  }
  shuffle(base);

  return prefix + '_' + (new Date).getTime() + '_' + base.slice(0, 10).join('');
}