
function shuffle( array, n ) {
  for ( ; n > 0; --n ) {
    var rand = Math.floor( Math.random() * n );
    var tmp = array[ rand ];
    array[ rand ] = array[n];
    array[n] = tmp;
  }
}

var Random = function( array, have ) {
  if ( !( this instanceof Random ) ) {
    return new Random( array, have );
  }
  this.core = array;
  this.have = have || 0;
  this.length = array.length - 1;
  this.sync();
};

Random.prototype.sync = function( tag ) {
  if ( tag === false ) {
    try {
      localStorage.clear();
    } catch(e) {}
    return;
  }
  try {
    localStorage.have = JSON.stringify( this.have );
    localStorage.core = JSON.stringify( this.core );
  } catch(e) {}
};

Random.prototype.get = function( n ) {
  var ret = [];
  while ( n > 0 ) {
    var crt = this.length - this.have;
    if ( crt > 0 ) {
      shuffle( this.core, crt );
      ret[ ret.length ] = this.core[ crt ];
      ++this.have;
    }
    --n;
  }
  this.sync();
  return ret;
};

Random.prototype.reset = function() {
  this.have = 0;
  this.sync( false );
};

function initRandom( n ) {
  var array = [], i = 1, length = n;
  array.length = length;
  while ( i <= array.length ) {
    array[i-1] = i;
    ++i;
  }
  return new Random( array );
}

function init() {
  var random, prepare = true;
  try {
    random = Random( 
      JSON.parse(localStorage.core), 
      JSON.parse(localStorage.have) 
    );
  } catch(e) {
    prepare = false;
  }

  if ( !prepare ) {
    var length = prompt( '输入随机范围最大值?', 100 );
    random = initRandom( +length || 100 );
  }

  /*!
    app
  */
  var btn = document.getElementById( 'button' );
  var number = document.getElementById( 'number' );
  var result = document.getElementById( 'result' );
  var reset = document.getElementById( 'reset' );

  var splitvalue = ' ';
  var string = result.value.trim();
  var have_string = random.core.slice( random.core.length - random.have ).join( splitvalue );
  result.value = (string ? '\n' : '' ) + have_string + string;

  btn.onclick = function() {
    var ret = random.get( +number.value || 1 );
    var string = result.value.trim();
    result.value = ( string ? string + '\n' : string )
      + ret.join( splitvalue );
  };

  reset.onclick = function() {
    random.reset();
    result.value = '';
  };

}

init();
