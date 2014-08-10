



define(function (require, exports, module) {

    var $ = require('./jquery');
    var response = require('./response');
    var debug = require('./log');

    var userInput = $('#user-input');

    function inputChange (e) {
        var val = userInput.val();
        response.append(val);
        debug.log('typing');
    }

    exports.init = function () {
        userInput.bind('input', inputChange);
    };

});



