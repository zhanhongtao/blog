

var a = r( 1 );
var b = r(function() {
  return a.value() + 2;
});

c = b.value();

b.on( a.name, function() {
  c = b.value();
});

console.log( c );

a.update( 2 );
console.log( c );
