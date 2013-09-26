

var test = function( bool, message ) {
  if ( arguments.length < 2 ) {
    bool = false, mesage = '缺少参数';
  }
  var color = bool ? 'color: green' : 'color: red';
  console.log( '%c%s', color, message );
};

var testcases = {
  queue: [],
  timeout: 5,
  noop: function() {},
  add: function( name, testcase ) {
    this.queue.push({
      testcase: testcase,
      name: name
    });
  },
  start: function( callback ) {
    var self = this;
    var length = this.queue.length;
    callback = typeof callback == 'function' ? callback : this.noop;
    se.queue( this.queue, function( item, index, next ) {
      var timer;
      item.testcase(function() {
        length--;
        if ( timer ) {
          clearTimeout( timer );
          timer = null;
        }
        next();
      });
      timer = setTimeout(function() {
        next( item.name );
        timer = null;
      }, self.timeout * 1000);
    }, function() {
      callback.apply( this, arguments );
    });
  }
};

