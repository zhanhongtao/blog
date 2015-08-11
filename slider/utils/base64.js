function base64Encode( code ) {
  try {
    return btoa( code );
  }
  catch(e) {
    alert( '异常或浏览器不支持 btoa 函数' );
  }
};

function base64Decode( code ) {
  try {
    return atob( code );
  }
  catch(e) {
    alert( '异常或浏览器不支持 atob 函数' );
  }
}
