
function _validate (value, key) {
  if (key === 'price') {
    return /^\+?\d+(?:\.\d+)?$/.test(value)
  } else if (key === 'id') {
    return true
  }
}

Table.fn.bind = function () {
  var self = this
  $(document).on('change', '#' + this._auto_id + ' input', function (e) {
    var data = $(this).closest('td').data()
    var cnd = self.createQuery(data.row)
    var key = data.key
    var item = self.query(cnd)
    var value = $.trim(this.value)
    var is = _validate(value, key)
    if (is) {
      if (item) {
        item[key] = value
      } else {
        cnd[key] = value
        self.db.push(cnd)
      }
      try {
        window.localStorage.table = JSON.stringify(self.db)
      } catch (e) {}
    }
    $(this).toggleClass('table-warning', !is)
  })
}
