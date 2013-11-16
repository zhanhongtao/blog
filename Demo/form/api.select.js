



;(function () {
    /*
        type:
            返回 'select-multiple', 'select-one';
        options:
            返回 HTMLOptionsCollection.
        length:
            返回 option 的长度.
            set 时:
            如果比原 optionsList 小, 那么会截断.
            否则, 添加空的 blank option.
        .item(index) 或者
        select[index]:
            返回指定索引的 option.
        .namedItem(name):
            返回指定 name/id 值为 name 的 option.
            如果存在多个 name option 时, 返回 list;
            不存在时, 返回 null.
        .add(element [, before]);
        .remove()
        .selectedOptions:
            返回选中的 HTMLOptionsCollection;
            没选中元素时, undefined.
        .selecedIndex:
            返回第一个被选中的 option 的索引.
            如果没有选中元素的话, 返回 -1.
            set:
        .value:
            返回第一个被选中元素的值.
            set:
     */
    var add = $('addoption');
    var remove = $('removeoption');
    var iselect = $('iselect');
    var testcase = {
        'type': function () {
            var message = '- 测试 api 中 type 属性!';
            var ret = iselect.type === 'select-one';
            return [message, ret];
        },
        'options': function () {
            var message = '- 测试 api 中 options 属性!';
            var apiO = iselect.options;
            var apiG = iselect.getElementsByTagName('option');
            var ret = apiO.length === apiG.length;
            if (ret) {
                for (var i = 0, l = apiO.length; i < l; i++) {
                    if (apiO[i] !== apiG[i]) {
                        ret = false;
                        break;
                    }
                }
            }
            return [message, ret];
        },
        'length': function () {
            var message = '- 测试 api 中 length 属性!';
            var ret = iselect.length === 4;
            return [message, ret];
        },
        'index': function () {
            var message = '- 测试 api 中 select[index]!';
            var ret = iselect[0] === iselect.getElementsByTagName('option')[0] &&
                iselect[1] === iselect.getElementsByTagName('option')[1];
            return [message, ret];
        },
        'item': function () {
            var message = '- 测试 api 中 select.item(index)!';
            var ret = iselect.item(0) === iselect.getElementsByTagName('option')[0] &&
                iselect.item(1) === iselect.getElementsByTagName('option')[1];
            return [message, ret];
        },
        'namedItem': function () {
            var message = '- 测试 api 中 .namedItem() 方法!';
            var ret = iselect.namedItem('xa') === iselect.getElementsByTagName('option')[0] &&
                iselect.namedItem('xb') === iselect.getElementsByTagName('option')[1];
            return [message, ret];
        },
        'selectedOptions': function () {
            var message = '- 测试 api 中 selectedOptions 属性!';
            var apiO = iselect.selectedOptions;
            var options = iselect.getElementsByTagName('option');
            var apiG = [];
            var item;
            for (var i = 0, l = options.length; i < l; i++) {
                item = options[i];
                if (item.selected) {
                    apiG.push(item);
                }
            }
            var ret = true;
            if (apiO == null && apiG.length == 0) {
                ret = true;
            }

            if (ret && apiO) {
                ret = apiO.length === apiG.length;
                if (ret) {
                    for (var i = 0, l = apiO.length; i < l; i++) {
                        if (apiO[i] !== apiG[i]) {
                            ret = false;
                            break;
                        }
                    }
                }
            }
            else {
                ret = false;
            }
            return [message, ret];
        },
        'selectedIndex': function () {
            var message = '- 测试 api 中 selectedIndex 属性!';
            // 规范定义, 返回第一个 selected 元素.
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-button-element.html#the-select-element
            var ret = iselect.selectedIndex === 1;
            return [message, ret];
        },
        'value': function () {
            var message = '- 测试 api 中 value 属性!';
            // 规范定义, 返回第一个 selected 元素.
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-button-element.html#the-select-element
            var ret = iselect.value === 'b';
            return [message, ret];
        }
    };

    for (var key in testcase) {
        try {
            var ret = testcase[key]();
            console.log.apply(console, [].concat(ret).reverse());
        }
        catch(e) {
            console.log(e);
        }
    }
})();



