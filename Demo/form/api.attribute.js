



var $ = function (key) {
    return document.getElementById(key);
};




;(function () {
    var testcase = {
        'password': function (){
            var message = '测试 type 为 password 元素的 value: ';
            var ret = $('password').value === 'password';
            return [message, ret];
        } ,
        'text': function () {
            var message = '测试 type 为 text 元素的 value: ';
            var ret = $('text').value === 'test value';
            return [message, ret];
        },
        'checkboxOn': function () {
            var message = '测试 type 为 checkbox(On) 元素的 value: ';
            var ret = $('checkboxOn').value === 'on';
            return [message, ret];
        },
        'checkboxOff': function () {
            var message = '测试 type 为 checkbox(Off) 元素的 value: ';
            var ret = $('checkboxOff').value === 'on';
            return [message, ret];
        },
        'radioOn': function () {
            var message = '测试 type 为 radio(on) 元素的 value: ';
            var ret = $('radioOn').value === 'on';
            return [message, ret];
        },
        'radioOff': function () {
            var message = '测试 type 为 radio(off) 元素的 value: ';
            var ret = $('radioOff').value === 'on';
            return [message, ret];
        },
        'number': function () {
            var message = '测试 type 为 number 元素的 value: ';
            var ret = $('number').value === '4';
            return [message, ret];
        },
        'valueAsNumber': function () {
            var message = '测试 type 为 number 元素的 valueAsNumber: ';
            var ret = $('number').valueAsNumber === 4;
            return [message, ret];
        },
        'stepUp': function () {
            var message = '测试 type 为 number 元素的 stepUp() 方法: ';
            try {
                $('stepUp').stepUp(1);
            }
            catch (e) {
                console.log(e);
            }
            var ret = $('stepUp').value === '7';
            return [message, ret];
        },
        'stepDown': function () {
            var message = '测试 type 为 number 元素的 stepDown() 方法: ';
            try {
                $('stepDown').stepDown();
            }
            catch (e) {
                console.log(e);
            }
            var ret = $('stepDown').value === '3';
            return [message, ret];
        },
        'datatime': function () {
            return [$('datetime').value];
        },
        'list': function () {
            var message = '测试具有 list 属性:';
            var ret = $('list').list === $('datalist');
            return [message, ret];
        }
    };

    function test() {
        var ret;
        for (var key in testcase) {
            try {
                ret = testcase[key]();
                if (ret) {
                    console.log.apply(console, [].concat(ret).reverse());
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    test();
})();



