+function () {

function noop() {}

function type(s) {
  return Object.prototype.toString.call(s).slice(8, -1).toLowerCase();
}

function walkToRoot( node, handle ) {
  while ( node && handle(node) === true ) {
    node = node.parentNode;
  }
  return node;
}

function walkDOMTreeByDeep( root, conf ) {
  conf = type(conf) == 'object' ? conf : {handle: noop, layer: 0};
  if ( type(root) !== 'array' ) root = [ root ];
  var i = 0, l = root.length;
  while ( i < l ){
    var element = root[i];
    if ( type(conf.handle) == 'function' ) {
      conf.handle( element );
    }
    var children = element.children;
    if ( children && children.length ) {
      ++conf.layer;
      children = Array.prototype.slice.call( children );
      walkDOMTreeByDeep( children, conf );
      --conf.layer;
    }
    ++i;
  }
  if ( conf.layer === 0 ) {
    if ( type(conf.complete) == 'function' ) {
      conf.complete();
    }
  }
}

function walkDOMTreeByBreadth( root, conf ) {
  var stack;
  var push = Array.prototype.push;
  var tag = {};
  conf = type(conf) == 'object' ? conf : {handle: noop,layer: 0};
  if ( type(root) == 'array' ) stack = root;
  else stack = [ root ];
  while ( stack.length > 0 ) {
    var current = stack.shift();
    if ( current === tag ) {
      ++conf.layer;
    }
    else {
      if (type(conf.handle) == 'function') {
        conf.handle( current );
      }
      var children = current.children;
      if ( children.length ) {
        stack.push( tag );
        push.apply( stack, children );
      }
    }
  }
  if ( type(conf.complete) == 'function' ) {
    conf.complete();
  }
}

walkDOMTreeByDeep(
  document.getElementById( 'box' ),
  {
    layer: 0,
    deep: [],
    handle: function( element ){
      this.deep.push( element );
    },
    complete: function() {
      console.log( 'deep:', this.deep );
    }
  }
);

walkDOMTreeByBreadth(
  document.getElementById( 'box' ),
  {
    layer: 0,
    breadth: [],
    handle: function( element ){
      this.breadth.push( element );
    },
    complete: function() {
      console.log( 'breadth:', this.breadth );
    }
  }
);

}();
