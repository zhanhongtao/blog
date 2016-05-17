function encode( code, base, left, right, length, hijack ) {
  if ( typeof code !== 'string' ) return '';
  base = +base || 16;
  left = typeof left === 'string' ? left : '&#x';
  right = typeof right == 'string' ? right : ';';
  typeof length === 'undefined' && ( length = 3 );
  hijack = typeof hijack === 'function' ? hijack : function() { return; };
  var ret = '', padding = 0;
  for ( var i = 0, l = code.length, char; i < l; i++ ) {
    char = hijack( code.charAt(i) );
    if ( typeof char !== 'string' ) {
      char = ( code.charCodeAt(i) ).toString( base );
      padding = length - String(char).length + 1;
      if ( padding < 1 ) padding = 0;
      char = left + (new Array(padding)).join('0') + char + right;
    }
    ret += char;
    padding = 0;
  }
  return ret;
}

function encode216( code, base, left, right, length ) {
  base = 16, left = '&#x', right = ';', length = 4;
  return encode( code, base, left, right, length );
}

function encode210( code, base, left, right, length ) {
  base = 10, left = '&#', right = ';', length = 0;
  return encode( code, base, left, right, length );
}

function encode28( code, base, left, right, length ) {
  base = 8, left = '\\', right = '', length = 0;
  return encode( code, base, left, right, length );
}

function encodeX( code, base, left, right, length ) {
  base = 16, left = '\\x', right = '', length = 0;
  return encode( code, base, left, right, length );
}

function unicode( code ) {
  return encode( code, 16, '\\u', '', 4 );
}

