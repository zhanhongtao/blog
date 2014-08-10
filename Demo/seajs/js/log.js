



define(function (require, exports, module) {

	/**
	 * 填补数字的空白
	 * @param {number} num 需要填补空白的数字
	 * @param {number} count 需要凑齐的位数
	 * @param {string} letter 填补的字母
	 */
	function pad(num, count, letter) {
		if(!letter) letter = '0';
		var len = num.toString().length;
		while(len < count) {
			num = letter + num;
			len++;
		}
		return num;
	}

    function getTimeStr() {
		var d = new Date();
		var year = d.getFullYear();
		var month = pad(d.getMonth() + 1, 2);
		var date = pad(d.getDate(), 2);
		var hour = pad(d.getHours(), 2);
		var minute = pad(d.getMinutes(), 2);
        var second = pad(d.getSeconds(), 2);
		return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
	}

    var $ = require('jquery');
    var debug = $('#debug');

    function log(msg) {
        var logArr = debug.html().split('<br />');
        logArr.push(getTimeStr() + ' | ' + msg);
        debug.html(logArr.reverse().join('<br />'));
    }

    exports.log = log;

});