

if ( typeof se === 'undefined' ) {
  se = {};
}

Array.prototype.indexOf = Array.prototype.indexOf || function( key ) {
  for ( var i = 0, l = this.length; i < l; ++i ) {
    if ( key === this[ i ] ) return i; 
  }
  return -1;
};

se.guid = 0;
se.version = '0.1.0';
se.expando = 'se' + ( se.version + Math.random() ).replace( /\D/g, '' );
se.type = (function( tostring ) {
  return function( value ) {
    return tostring.call( value ).slice( 8, -1 ).toLowerCase(); 
  }; 
})( Object.prototype.toString );

se.isPlainObject = function( value ) {
  return se.type( value ) === 'object';
};

se.extend = function( deep ) {
  var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    // Skip the boolean and the target
    target = arguments[ i ] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && se.type(target) !== 'function' ) {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( se.isPlainObject(copy) || (copyIsArray = se.type(copy)=== 'array') ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && (se.type(src)==='array') ? src : [];

          } else {
            clone = src && se.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = se.extend( deep, clone, copy );

          // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

 ;(function() {

  var caches = {}, 
      // key -> 'xxx.xxx'
      expando = se.expando + Math.random();
 
  // write( node, keyMap );
  // write( node, key, value );
  // write 时, 写到 cache 上. 
  // read( node ); -> table + data-
  // read( node, key ); -> tableCache > data-
  // data 模块和 data- 在写时不冲突. 即:
  // 使用 data.remove 后, 原生 JavaScript 依然可以读到.
  function data( context, key, value, pvt ) {
    var unlock = context[ expando ];
    if ( !unlock ) {
      unlock = context[ expando ] = ++se.guid;
      table = caches[ unlock ] = { data: {} };
    } else {
      table = caches[ unlock ];
    }
    var cache = table;
    if ( !pvt ) table = table.data;
    // key 为 object.
    // write. 
    if ( se.type(key) === 'object' ) {
      se.extend( !0, table, key ); 
    }
    else if ( se.type(key) === 'string' ) {
      // write. 
      if ( value !== void 0 ) {
        table[ key ] = value;
      }
    }
    // read.
    // 已 cache 或已经直接写到 cache 中!
    if ( key in table ) {
      return table[ key ];
    }
    if ( cache.read ) {
      return table;
    }
    cache.read = !0;
    // 如果 context 是 dom 节点, 使用 dataset 读数据. 
    if ( context && context.nodeType === 1 ) {
      return dataAttr( context, key, table );
    }
    return table;
  }

  function fix( value ) {
    var data;
    try {
      data = eval( '0,' + value ); // eval( '(' + value + ')' );
    } catch(e) {
      data = value;
    }
    return data;
  }

  function dataAttr( node, key, table ) {
    var attributes = node.attributes;
    for ( var i = 0, l = attributes.length; i < l; ++i ) {
      var attribute = attributes[i];
      if ( attribute.nodeName.indexOf( 'data-' ) === 0 ) {
        table[ attribute.nodeName.slice(5) ] = fix( attribute.nodeValue );
      }
    }
    if ( se.type(key) === 'string' ) {
      return table[ key ];
    }
    return table;
  }

  // @note: data- 属性节点和 data 函数是独立存在的.
  // remove( node );
  // remove( node, key );
  // remove( node, key, true );
  function remove( node, key, pvt ) {
    var unlock = node[ expando ];
    if ( !unlock ) return;
    var table = caches[ unlock ], cache = table;
    if ( !pvt ) table = table.data;
    if ( key === void 0 ) {
      for ( var key in table ) {
        if ( !(pvt && key === 'data') ) {
          delete table[ key ];
        }
      }
    }
    if ( typeof key === 'string' ) {
      delete table[ key ];
    }
  }

  se.extend( se, {
    data: function( target, key, value ) {
      return data( target, key, value );
    },
    _data: function() {
      return data( target, key, value, !0 );
    },
    removeData: function( target, key ) {
      return remove( target, key );   
    },
    _removeData: function( target, key ) {
      return remove( target, key, !0 );
    }
  });

})(); 


