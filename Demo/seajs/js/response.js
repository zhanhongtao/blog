



define(function (require, exports) {
    var $ = require('./jquery');
    var repeater = $('#repeater');

    function append(val) {
        val = val.replace(/</g, '&lt;')
                .replace(/\n/g, '<br />');
        repeater.html(val);
    }

    exports.append = append;
});



