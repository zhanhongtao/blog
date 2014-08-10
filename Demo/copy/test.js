


if (!window.console) {
    window.console = {
        log: function () {

        }
    };
}

var log = document.getElementById('log');
function debug(string) {
    log.innerHTML = log.innerHTML + '<br />' + string;
}

;(function () {
    var test = document.getElementById('test');
    var copyButton = document.getElementById('copy');

    // 尝试使用 setMoviePath() method.
    ZeroClipboard.setMoviePath( 'ZeroClipboard10.swf' );

    // 初始化文本
    test.value = 'ZeroClipboard - FlashCopy!';

    // 初绐化 clip 对象.
    var clip = new ZeroClipboard.Client();

    // Flash 关联 DOM.
    clip.glue( 'copy' );

    // 绑定完成事件.
    clip.addEventListener( 'onComplete', function () {
        debug(clip.clipText);
        // 修正当 DOM 结构发生变化时,
        // 重置 Flash 层位置.
        clip.reposition();
    });

    // 设置复杂文本.
    // 用户操作后, 设置文本.
    clip.addEventListener( 'onmouseover', function () {
        clip.setText( test.value );
    });

}());

;(function () {
    var list = document.getElementById('list');
    var items = list.getElementsByTagName('li');
    var i = 0, l = items.length, item;
    for ( ; i < l; i++ ) {
        (function (item) {
            item.onmouseover = function () {
                if (this.__clip__) {
                    return;
                }
                this.__clip__ = true;
                var clip = new ZeroClipboard.Client();
                clip.setText( this.innerText );
                // 相对 ul#list 绑定 Flash 和 DOM 关系.
                clip.glue( this, 'list' );
                clip.addEventListener( 'oncomplete', function () {
                    debug(clip.clipText);
                } );
            };
        }(items[i]));
    }
} ());



