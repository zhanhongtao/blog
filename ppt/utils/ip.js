function ipcode( code ) {
  var base16 = '';
  var tmp = code.split( '.' );
  for ( var i = 0, l = tmp.length; i < l; ++i ) {
    var value = tmp[i];
    console.log( value, (+value).toString(16) );
    base16 += ( +value ).toString(16);
  }
  return '0' + ( parseInt(base16,16) ).toString(8);
}

function ipdecode( code ) {
  var base10 = parseInt( code, 8 );
  var base16 = (base10).toString(16);
  console.log( base16 ); // 6277194770 
  // 各种情况么...
}

