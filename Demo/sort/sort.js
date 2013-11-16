



// 堆定义: 完全二叉树, 所有树中, 根节点比 leftChild / rightChild 都大.
// 堆排序原理: 生成最大堆, 交换跟节点和最后一个节点位置, 移除最后一个节点(此节点为已排序元素);
// 重复上面操作.

// 1, 生成最大堆. -> Math.ceil(len / 2);
// 2, 根和最后一个元素替换.
// 3, 隔离最后一个元素.
// 4, 重复1操作, 知道仅剩最后一个元素为止.
function heapSort(arr) {
    var a = [0].concat(arr);
    var len = arr.length;
    var pivot = Math.ceil(len / 2);
    for (; pivot > 0; pivot--) {
        create(a, pivot);
    }

    var ret = [];
    for (; len-- > 0; ) {
        var tmp = a[1];
        a[1] = a.pop();
        create(a, 1);
        ret = ret.concat(tmp);
    }

    function create(a, pivot) {
        var cur = a[pivot];
        for (var j = pivot * 2; j <= len; j *= 2) {
            // left, right 节点中最大值, 以确定 j.
            // j < len 后, 才能取 j + 1.
            if (j < len &&  a[j] < a[j + 1]) j++;
            // 已正确排序.
            if (cur >= a[j]) break;
            // 更新 pivot 值.
            a[pivot] = a[j];
            pivot = j;
        }
        a[pivot] = cur;
    }

    return ret;
}

// 归并(合并)排序.
// 原理: 二分法.
// 把排序元素分成两份, 再对两份在分, 知道都仅有一个元素位置.
// 然后把两两按大小合并.

// 类似: 两个人, 每人手拿一半扑克牌(牌已排序). 两人都从最上取牌, 谁的牌最小, 就把谁的牌放到下面， 而另一个人牌不动.
// 依次到有人的牌出完, 最后剩牌的人把所有的牌放到最上面.
function mergeSort(a) {
    var len = a.length;
    if (len < 2) return a;
    var merge = function (a, b) {
        var ret = [];
        while (a.length && b.length)
            ret.push(a[0] > b[0] ? a.shift() : b.shift());
        return ret.concat(a, b);
    };
    var pivot = Math.ceil(len / 2),
        left = a.slice(0, pivot),
        right = a.slice(pivot);
    return merge(mergeSort(left), mergeSort(right));
}


// 原理类似归并排序.
// 但是快速排序不是按总数的一半二分的.
// 是按 pivot(一个合理的数字), 分成比它大/小/相等的三部分.
// 最后直接合并.
function quickSort(arr) {
    var len = arr.length;
    if (len < 2) return arr;
    var ret = [],
        pivot = arr[Math.ceil(len / 2)],
        less = [],
        more = [],
        equal = [],
        item;
    for (var i = 0; i < len; i++) {
        item = arr[i];
        item < pivot ? less.push(item) : item > pivot ? more.push(item) : equal.push(item);
    }
    return ret.concat(quickSort(more), equal, quickSort(less));
}

// 插入排序.
//原理类似： 打牌时摆牌阶段, 抓到一张牌要按大小顺序插入到合适位置.
// 按一定顺序(大到小), 找到插入位置, 查找过程中要移动牌, 最后插入即可.
function insertSort(arr) {
    var len = arr.length,
        i = 1,
        j, cur;
    if (len < 2) return arr;
    for (; i < len; i++) {
        j = i - 1, cur = arr[i];
        while (j > -1 && cur > arr[j]) {
            arr[j + 1] = arr[j--];
        }
        arr[j + 1] = cur;
    }
}


// 选择排序思想:
// 遍历所有元素, 然后找比当前元素小的最小值. 交换位置.
function selectSort(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        var min = i,
            cur = arr[min];
        for (var j = i + 1; j < len; j++) {
            if (arr[min] < arr[j]) {
                min = j;
            }
        }
        if (i != min) {
            arr[i] = arr[min];
            arr[min] = cur;
        }
    }
}


/**
    n - 1, n - 2, n - 3, n - 4 ......, 3, 2, 1.
    公式: n * (n + 1) / 2 ->
    n * (n - 1) / 2 -> n^2.
*/

// 冒泡...  冒吧, 泡吧.
function bubbleSort(arr) {
    var i = 0, j, len = arr.length;
    if (len < 2) return arr;
    for (; i < len; i++) {
        for (j = i + 1; j < len; j++) {
            if (arr[i] < arr[j]) {
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }
    }
}



