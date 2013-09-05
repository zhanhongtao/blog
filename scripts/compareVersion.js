/*
  a, b 格式:
  ex: 4.0, 4.1.2, 4.1.10.7890
  ex: 1.0, 1 比较
  return -1(低), 0(相同), 1(高)
*/
function compareVersion( a, b ) {
  var aVersions = a.split( '.' );
  var bVersions = b.split( '.' );
  var ret = 0;
  var maxLength = Math.max( aVersions.length, bVersions.length );
  for( var i = 0; i < maxLength; i++ ) {
    // 不存在时, 按 0 处理.
    var av = ~~aVersions[i];
    var bv = ~~bVersions[i];
    if ( av > bv ) {
      ret = 1;
    }
    else if ( av < bv ) {
      ret = -1;
    }
    if ( ret != 0 ) {
      break;
    }
  }
  return ret;
}


/**
  var v1 = compareVersion( '1', '1' );
  var v12 = compareVersion( '1.1.0', '1.1' );
  var v13 = compareVersion( '1.1.1', '1.1.1' );
  var v14 = compareVersion( '1', '1.0' );
  console.assert( v1 === 0, '版本相同' );
  console.assert( v12 === 0, '版本相同' );
  console.assert( v13 === 0, '版本相同' );
  console.assert( v14 === 0, '版本相同' );

  var v2 = compareVersion( '1', '0' ); // 大版本.
  var v22 = compareVersion( '1.10', '1.9' ); // 小版本.
  var v23 = compareVersion( '1.9.10', '1.9.9' ); // build

  var v24 = compareVersion( '1.0', '0.9' ); // 大版本.

  console.assert( v2 === 1, '版本高' );
  console.assert( v22 === 1, '版本高' );
  console.assert( v23 === 1, '版本高' );
  console.assert( v24 === 1, '版本高' );
*/
