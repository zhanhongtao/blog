

// 15 的二进制表示为:
// 1111 = 8 + 4 + 2 + 1
// 每一位表示一个状态, 所以 15 可表示 4 个状态

// 如何使用两个骰子表示月份中的每一天
// 31 使用 6 进制表示
// 55 = 5 * 6 + 5 > 31

// 取二进制位中第 N 位上的值是? (1/0)
function readIndex( value, n ) {
  return ( value & (1 << (n-1)) ) > 0;
}

// 设置二进制位中第 N 位上的值(1/0)
function setBit( num, i, v ) {
  var a = 1 << (i-1);
  var b = ~a;
  var c = num & b;
  var d = v << (i-1);
  return c | d;
}

// 求数组中出现奇数次的单个元素
// 利用 a ^ a == 0
function find( array ) {
  return array.reduce(function( a, b ) {
    return a ^ b;
  });
}

// 进制转换
function convert( n, b ) {
  b = b || 10;
  if (n == 1) return 1;
  var tmp = [];
  while ( n >= b ) {
    tmp.push( n % b );
    n = Math.floor( n / b );
  }
  if ( n ) {
    tmp.push( n );
  }
  var ret = '';
  while ( tmp.length ) {
    ret += tmp.pop();
  }
  return ret;
}

// JavaScript 版本.
function convert( n, b ) {
  return n.toString(b || 10);
}

function toRGB( color ) {
  var n = parseInt( color, 16 );
  return [ n >> 16, (n >> 8) & 255, n & 255 ];
  // Math.pow( 2, 8 ) === 16 * 16
}

function toHex( r, g, b ) {
  return ( ( r << 16 | g << 8 | b ) | (1 << 24) ).toString( 16 ).slice(1);
  // parseInt( 'f', 16 ) -> 15 -> 2 << 4 - 1
  // 4 * 6 -> 24
}