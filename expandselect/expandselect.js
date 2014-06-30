;(function() {

  var id = 0;
  var namespace = 'expandselect';

  function render( selects, i, j, checked ) {
    var max = Math.max( i, j ),
        min = Math.min( i, j );
    while ( min < max ) {
      selects[ min++ ].checked = !!checked;
    }
  }

  function each( array, func ) {
    for ( var i = 0, l = array.length; i < l; ++i ) {
      func.call( null, array[i], i, array );
    }
  }

  function ExpandSelection( dom ) {
    this.core = dom;
    this.last = -1;
    this.init();
  };

  ExpandSelection.prototype.empty = function() {
    each( this.core, function( dom ) {
      dom.checked = !!0;
    });
  };

  ExpandSelection.prototype.all = function() {
    each( this.core, function( dom ) {
      dom.checked = !!1;
    });
  };

  ExpandSelection.prototype.reverse = function() {
    each( this.core, function( dom ) {
      dom.checked = !dom.checked;
    });
  };

  ExpandSelection.prototype.init = function() {
    var key = namespace + '_' + (++id);
    var self = this;

    each( this.core, function( dom, index ) {
      dom[ key ] = index;
    });

    each( this.core, function( dom, index, nodelist ) {
      dom.onclick = function(e) {
        e = e || window.event;
        var index = this[ key ];
        var checked = this.checked;
        var last = self.last;
        if ( e.shiftKey && last !== -1 ) {
          if ( checked === nodelist[ last ].checked ) {
            render( nodelist, last, index, checked );
          }
        }
        self.last = index;
      };

    });
  };

  window[ namespace ] = function( dom ) {
    return new ExpandSelection( dom );
  };

})();