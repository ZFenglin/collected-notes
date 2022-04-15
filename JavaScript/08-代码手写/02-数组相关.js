/////
///// 原型方法实现
///// 
/**
 * 手写flat
 * @param {Array} arr 
 * @param {Number} depth 
 * @returns 
 */
Array.prototype._flat = function (depth = 1) {
    if (!Array.isArray(this) || depth <= 0) return this
    return this.reduce(function (pre, cur) {
        return pre.concat(Array.isArray(cur) ? Array.prototype._flat.call(cur, depth - 1) : cur)
    }, [])
}
/**
 * 手写push 
 */
Array.prototype._push = function () {
    for (let i = 0; i < arguments.length; i++) {
        this[this.length] = arguments[i];
    }
    return this.length;
}
/**
 * 手写map
 * @param {Function} fn 
 */
Array.prototype._map = function (fn) {
    if (typeof fn !== 'function') {
        throw TypeError('fn must be function')
    }
    let res = []
    for (let index = 0; index < this.length; index++) {
        res.push(fn.call(this, this[index], index))
    }
    return res
}
/**
 * 手写filter
 * @param {Function} fn 
 */
Array.prototype._filter = function (fn) {
    if (typeof fn !== "function") {
        throw Error('参数必须是一个函数');
    }
    const res = [];
    for (let i = 0, len = this.length; i < len; i++) {
        fn(this[i]) && res.push(this[i]);
    }
    return res;
}



/////
///// 数组去重
///// 
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

/**
 * ES6处理
 */
Array.from(new Set(array)); // [1, 2, 3, 5, 9, 8]

/**
 * ES5处理
 */
function uniqueArray(array) {
    let map = {};
    let res = [];
    for (var i = 0; i < array.length; i++) {
        if (!map.hasOwnProperty([array[i]])) {
            map[array[i]] = 1;
            res.push(array[i]);
        }
    }
    return res;
}
uniqueArray(array); // [1, 2, 3, 5, 9, 8]



/////
///// 数组展开
///// 
/**
 * flat
 */
function flatten(arr) {
    // Infinity为全展开
    return arr.flat(Infinity);
}

/**
 * 字符串
 */
//  1. split 和 toString
function flatten(arr) {
    return arr.toString().split(',');
}
// 2. 正则和 JSON 方法
function flatten(arr) {
    let str = JSON.stringify(arr);
    str = str.replace(/(\[|\])/g, '');
    str = '[' + str + ']';
    return JSON.parse(str);
}

/**
 * concat递归实现
 */
// 1. 递归
function flatten(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}
// 2.reduce
function flatten(arr) {
    return arr.reduce(function (prev, next) {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

/**
 * 扩展运算符
 */
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}



/////
///// 其他方面
///// 
/**
 * 数组乱序（洗牌算法）
 * @param {Array} arr 
 */
function shuffle(arr) {
    for (let index = arr.length - 1; index > 0; index--) {
        randomIndex = Math.floor(Math.random() * (index - 1));
        [arr[randomIndex], arr[index]] = [arr[index], arr[randomIndex]];
    }
}

/**
 * 多层数组求和
 * @param {Array} array 
 * @returns 
 */
// 1. 字符串
function arrSum(array) {
    return array.toString().split(',').reduce((total, i) => total += Number(i), 0)
}
// 2. flat
function arrSum(array) {
    return array.flat(Infinity).reduce((total, i) => total += Number(i), 0)
}
// 3. 递归
function arrSum(array) {
    return array.reduce((pre, cur) => {
        if (Array.isArray(cur)) {
            return pre + arrSum(cur)
        } else {
            return pre + cur
        }
    }, 0)
}