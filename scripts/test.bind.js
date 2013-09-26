

;(function() {

  function testbind() {
    console.assert( this.name === 'se', 'test bind' );
  }
  se.bind( testbind, {name: 'se'} )();
})();


