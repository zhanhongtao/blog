



;(function () {
    var add = $('addoption');
    var remove = $('removeoption');
    var setLength = $('setLength');
    var selectedIndex = $('selectedIndex');
    var setValue = $('setValue');
    var iselect = $('xx');

    var inputIndex = $('inputIndex');

    add.onclick = function () {
        var element = document.createElement('option');
        element.value = 'x4';
        element.label = 'x4';
        // 使用 Option 构造函数方式.
        element = new Option('xf', 'xf', true, true);
        var index = inputIndex.value;
        index = index.replace(/^\s*|\s*$/g, '');
        var before = iselect.getElementsByTagName('option');
        if (index === '' || +index < 0) {
            iselect.add(element);
        }
        else {
            if (before.length < +index) {
                index = before.length - 1;
            }
            iselect.add(element, before[+index]);
        }
        return false;
    };

    remove.onclick = function () {
        var index = inputIndex.value;
        index = index.replace(/^\s*|\s*$/g, '');
        if (index === '' || +index < 0) {
            iselect.remove();
        }
        else {
            iselect.remove(index);
        }
        return false;
    };

    setLength.onclick = function () {
        var index = inputIndex.value;
        index = index.replace(/^\s*|\s*$/g, '');
        var options = iselect.getElementsByTagName('option');
        var len = options.length;
        if (+index < 0) {
            return false;
        }

        iselect.length = +index;
    };

    selectedIndex.onclick = function () {
        var index = inputIndex.value;
        index = index.replace(/^\s*|\s*$/g, '');
        iselect.selectedIndex = +index < 0 ? 0 : +index;
    };

    setValue.onclick = function () {
        var index = inputIndex.value;
        index = index.replace(/^\s*|\s*$/g, '');
        iselect.value = index;
    };

    
    var options = iselect.getElementsByTagName('option');
    var o = options[0];
    var testcase = {
        'selected': function () {
            var message = '- 测试 option 是否处于 checked!';
            var ret = o.selected === true;
            return [message, ret];
        },
        'index': function () {
            var message = '- 测试 option 的索引. ';
            var ret = o.index === 0;
            return [message, ret];
        },
        'text': function () {
            var message = '- 测试 option label 值!';
            var ret = o.text === 'x1';
            return [message, ret];
        },
        'form': function () {
            var message = '- 测试 option 所属 form!';
            var ret = o.form === document.getElementById('xform');
            return [message, ret];
        }        
    };
    
    for (var key in testcase) {
        try {
            var ret = testcase[key]();
            console.log.apply(console, [].concat(ret).reverse());
        }
        catch (e) {
            console.log(e);
        }
    }
})();



