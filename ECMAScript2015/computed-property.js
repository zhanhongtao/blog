;(() => {
  'use strict';

  let object = {
    ['a' + 1]: 'value',
    ['Apple'.toLowerCase()]: 'Apple'
  };

  let prefix = '_sogou_';
  let tt = {
    [prefix]: prefix,
    [prefix + 'id']: prefix + 'id'
  };

  console.log(object, tt, tt[prefix]);

  let TT = class {
    constructor (x) {
      this.x = x;
    }

    [prefix]() {
      console.log(prefix);
    }
  };

  let xt = new TT(prefix);
  xt[prefix]();

})();
