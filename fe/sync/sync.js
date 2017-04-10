function sync (list, fn, callback, tag) {
  callback = typeof callback === 'function' ? callback : function () {}
  var n = list.length
  if (n === 0) return callback()
  var times = 0
  var doneindex = 0
  var ret = []
  var donelist = []

  var checkDoneList = function (i, list, results) {
    var ret = []
    while (list[i] === i) ret.push(results[i++])
    return ret
  }

  var done = function (index) {
    return function (result) {
      times++
      ret[index] = result
      donelist[index] = index
      if (tag === 1) {
        var list = checkDoneList(doneindex, donelist, ret)
        if (list.length) {
          doneindex += list.length
          callback.apply(null, list)
        }
      } else if (tag === 2) callback(result)
      else if (times === n) callback.apply(null, ret)
    }
  }

  var i = -1
  var l = fn.length || 1
  while (++i < n) {
    var argus = [list[i], i, ret]
    argus[l - 1] = done(i)
    argus.length = l
    fn.apply(null, argus)
  }
}
