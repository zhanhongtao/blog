

var test = function( bool, message ) {
  if ( arguments.length < 2 ) {
    bool = false, mesage = '缺少参数';
  }
  var color = bool ? 'color: green' : 'color: red';
  console.log( '%c%s', color, message );
};