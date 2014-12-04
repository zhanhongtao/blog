
module.exports = function( grunt ) {

  grunt.initConfig({
    "replace-static": {
      options: {
        process: function( list, cwd, dest ) {
          return path.dirname( dest ) + '/' + md5( path.resolve(cwd, list[0]) ).slice(0,8) + path.extname( dest );
        }
      },
      dist: {
        expand: true,
        src: [ '*.html' ],
        dest: './result',
        cwd: './demo',
        matchBase: true
      }
    }
  });

  var path = require( 'path' );
  var fs = require( 'fs' );
  var crypto = require( 'crypto' );
  function md5(filepath, algorithm, encoding, fileEncoding) {
    var hash = crypto.createHash(algorithm || 'md5');
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    hash.update(grunt.file.read(filepath), fileEncoding);
    return hash.digest(encoding || 'hex');
  }

  function replaceprocess( file, options ) {
    var string = grunt.file.read( file, {encoding: options.encoding} );
    var parseBuildReg = /<!--\s*build:\s*([^ ]*)\s*([^ ]*)\s*-->([\s\S]*?)<!--\s*endbuild\s*-->/gi;
    var parseCSSReg = /<link.*?href\s*=\s*("|'|)?([^> ]*?)\1.*?\/?>/gi;
    var parseJSReg = /<script.*?src\s*=\s*("|'|)?([^> ]*?)\1.*?\/?>[\s\S]*?<\/script>/gi;
    var support = options.support || {
      'css': parseCSSReg,
      'js' : parseJSReg
    };

    var buildList = [];
    var id = 1;
    var prefix = 'build_replace_' + Date.now();
    
    string = string.replace( parseBuildReg, function( $0, type, dest, links, index, string ) {
      var reg = support[ type ];
      if ( !reg ) return string;
      var id = prefix + ( id++ );
      var current = {
        id: id,
        type: type,
        dest: dest,
        src: []
      };
      links.replace( reg, function( $0, $1, src ) {
        current.src.push( src );
      });
      buildList.push( current );
      return id;
    });
    
    buildList.forEach(function( obj ) {
      var id = obj.id;
      var type = obj.type;
      var list = obj.src;
      var dest = options.process( list, path.dirname(file), obj.dest ) || obj.dest;
      var str = type === 'css' ? '<link rel="stylesheet" href="{dest}">' : '<script src="{dest}"></script>';
      string = string.replace( id, str.replace('{dest}', dest) );
    });

    return string;
  }
  
  grunt.registerMultiTask( 'replace-static', function(when, task) {
    var options = this.options({
      encoding: 'utf8',
      process: function() {}
    });
    this.files.forEach(function( fileObj ) {
      var files = grunt.file.expand({nonull: true}, fileObj.src);
      files.forEach(function( file ) {
        if ( grunt.file.isFile(file) ) {
          var string = replaceprocess( file, options, fileObj );
          grunt.file.write( fileObj.dest, string, {encoding: options.encoding} );
        }
      });
    });
  });

  grunt.registerTask( 'default', [ 'replace-static' ] );

};

