/*
 *
 * 1. 去重复元素
 * 2. 统计 存在的类型, 以及个数 - 同1
 * 3. 把伪数组转化为真正的数组 - arguments/dom
 * 4. 反转数组/字符串
 * 5. swap - 函数只实现一个功能, 并且实现完美
 * 6. [1, 2, 3, 4, 5, 6, 7, 8] 奇数在前, 偶数在后, 并且保证顺序 - ?
 *    结果:
 *    [1, 3, 5, 7, 2, 4, 6, 8]
 *     思路: 反转(手心).
 * 7. 类似6, 只需要保证奇数在偶数之前即可.
 * 8. 快排.
 * 9. 进制之间的转换 - rgb/#fff
 * 10. 驼峰命名法
 *
 */


function swap(array, i, j) {
	var tmp = array[i];
	array[i] = array[j];
	array[j] = tmp;
}

function reverse(array) {
	var l = array.length;
	var i, j;
	for (i = 0, j = l - 1; i < j; ++i, --j) {
		swap(array, i, j);
	}
}

// 调整 array 中的任意区间.
// 来自小梅.
function reverseEX(array, low, high) {
	while (low < high) {
		swap(array, low++, high--);
	}
}

// index 可选, 默认值为 0
function toArray(array, index) {
	return Array.prototype.slice.call(array, index || 0);
}

// 生成新数组.
function uni(array) {
	var map = {}, ret = [];
	for (var i = 0, l = array.length; i < ; ++i) {
		var item = array[i];
		if (!map[item] ) {
			ret.push(item);
			map[item] = 1;
		}
	}
	return ret;
}

// 不生成新数组.
function uni(array) {
	var map = {};
	for ( var i = array.length - 1; i >= 0; --i) {
		var item = array[i];
		if (!map[item]) {
			map[item] = 1;
		} else {
		  array.splice(i, 1);
		}
	}
}


