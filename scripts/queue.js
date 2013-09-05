// 队列
// 存在依赖关系时使用 queue.
// ex:
// * 类似 jQuery 中的 queue.
// * http 相关的单元测试.
function queue( list, fn, callback, ret ) {

    var length = list.length;

    // 在 ret 中记录原始长度.
    ret = ret || [ length ];

    // 不污染原始数组.
    var old = ret[0] === length ? [].concat(list) : list;

    // value -> 当前返回值.
    // stop -> 是否停止运行, 并且只把当前 ret 返回给 callback.
    // returnCurrentValue -> 需要 stop 为真. 只返回当前 value 给 callback.
    var next = function ( value, stop, returnCurrentValue ) {
        ret[ ret.length ] = value;
        if ( stop ) {
            callback.apply( null, returnCurrentValue ? [value] : ret.slice(1) );
            return;
        }
        queue( (old.shift(), old ), fn, callback, ret );
    };

    if ( length > 0 ) {
        var argus = [ old[0], ret[0] - length, ret.slice(1) ];
        if ( fn.length ) {
            argus = argus.slice( 0, fn.length - 1 );
        }
        argus.push( next );
        fn.apply( null, argus );
    }
    else if ( callback && ret.shift() === ret.length ) {
        callback.apply( null, ret );
    }
}