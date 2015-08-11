function swap(array, i, j) {
  if (i != j) {
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

function random(i, j) {
  return Math.floor(Math.random() * (j - i + 1) + i);
}

function partialRandomOrder(array, i, j) {
  for (; i < j; ++i) {
    swap(array, i, random(i, j - 1));
  }
}

function sort(list, max) {
  max =  ~~max;
  var i = 0, l = list.length, j = 0, k = l - 1;
  while (i <= k) {
    var item = list[i];
    switch(item.type) {
      case 1:
        swap(list, i, j++);
        break;
      case 2:
        swap(list, i--, k--);
        break;
      default:
        break;
    }
    ++i;
  }
  if (j < max) {
    partialRandomOrder(list, ++k, l);
    while (j < max && k < l) {
      swap(list, k++, j++);
    }
  }
  partialRandomOrder(list, j, l);
}

console.table(_data.app.list);
sort(_data.app.list, 5);
console.table(_data.app.list);

