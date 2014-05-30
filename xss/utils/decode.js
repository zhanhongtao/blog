function decode( code, config ) {
  var base = config.base,
      left = config.left,
      right = config.right;
  var i = 0, l = code.length, ret = '';
  while ( i < l ) {
    i = i + String(left).length;
    var char = '', value = '';
    if ( right ) {
      while ( (value=code.charAt(i)) !== right ) {
        char += value;
        ++i;
      }
    }
    else {
      while( (value=code.charAt(i)) !== left.charAt(0) ) {
        char += value;
        ++i;
      }
    }
    ret += String.fromCharCode( parseInt(char, base) );
    i += String(right).length;
  }
  return ret;
}

function decode( code, config ) {
  var base = config.base,
      left = config.left,
      right = config.right;
  var ret = '';
  var array = code.split( left );
  $.each( array, function( key, value ) {
    value = value.replace( right, '' );
    ret += String.fromCharCode( parseInt( value, base ) );
  });
  return ret;
}