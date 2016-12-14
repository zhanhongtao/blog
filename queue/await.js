async function es(list, handle) {
  async function _handle(handle, args) {
    return new Promise(resolve => {
      args[args.length] = resolve;
      handle.apply(null, args);
    });
  }
  let i = 0;
  let l = list.length;
  let ret = [];
  let length = handle.length;
  while(i < l) {
    let args = [list[i], i, list, ret].slice(0, length - 1);
    ret[i++] = await _handle(handle, args);
  }
}
