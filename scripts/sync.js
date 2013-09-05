// 同步.
// 不存在依赖关系, 可同时执行, 最后返回结果.
// ex:
// * 类似 jQuery 中的 when.
function sync( list, fn, callback ) {
    var n = list.length;
    var times = 0;
    var ret = [];
    var wrapper = function () {
        if ( times === n && callback ) {
            callback.apply( null, ret );
        }
    };
    var done = function ( index ) {
        return function ( result, stoped ) {
            if ( stoped ) {
                callback.call( null, result );
                return;
            }
            times++;
            ret[index] = result;
            wrapper();
        };
    };
    if ( n === 0 ) {
        wrapper();
        return;
    }
    var i = 0;
    var item;
    while ( i < n ) {
        item = list[ i ];
        var argus = [ item, i, ret ];
        var cb = done( i );
        if ( fn.length ) argus = argus.slice( 0, fn.length - 1 );
        argus[argus.length] = cb;
        fn.apply( null, argus );
        i++;
    }
}
