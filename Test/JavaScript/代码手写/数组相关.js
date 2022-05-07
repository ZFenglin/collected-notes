////////// 原型方法实现
/**
 * 手写flat
 * @param {*} depth 
 */
Array.prototype._flat = function (depth = 1) {
    if (depth <= 0 || !Array.isArray(this)) return this
    return this.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? Array.prototype._flat.call(cur, depth - 1) : cur), [])
}

/**
 * 手写push
 */
Array.prototype._push = function () {
    for (let index = 0; index < arguments.length; index++) {
        this[this.length] = arguments[index]
    }
    return this.length
}

/**
 * 手写map
 * @param {*} fn 
 * @returns 
 */
Array.prototype._map = function (fn) {
    if (typeof fn !== 'function') {
        throw 'fn must be function'
    }
    let res = []
    for (let index = 0; index < this.length; index++) {
        res.push(fn.call(this, this[index], index))
    }
    return res
}

/**
 * 手写filter
 * @param {*} fn 
 * @returns 
 */
Array.prototype._filter = function (fn) {
    if (typeof fn !== 'function') {
        throw 'fn must be function'
    }
    let res = []
    for (let index = 0; index < this.length; index++) {
        fn.call(this, this[index]) && res.push(this[index])
    }
    return res
}

const arr = [1, 1, [2, [3]]]
console.log(arr._flat())
console.log(arr._flat(2))
console.log(arr._flat(3))
console.log(arr._push(4), arr)
console.log(arr._map((value, index) => ({ value, index })))
console.log(arr._filter((value) => typeof value === 'number'))

////////// 数组去重
// 1. ES6
function uniqueArrayES6(arr) {
    return Array.from(new Set(arr))
}
// 2. ES5
function uniqueArrayES5(arr) {
    let map = Object.create(null)
    let res = []
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index]
        if (!map[element]) {
            map[element] = true
            res.push(element)
        }
    }
    return res
}

let uniqueArray = [1, 2, 3, 2, 4, 3]
console.log(uniqueArrayES5(uniqueArray))
console.log(uniqueArrayES6(uniqueArray))

////////// 数组展开
// 1.flat
function flatFlatten(arr) {
    return arr.flat(Infinity);
}
// 2. toString
function toStringFlatten(arr) {
    return arr.toString().split(',')
}
// 3. JSON.stringify
function stringifyFlatten(arr) {
    return JSON.parse('[' + JSON.stringify(arr).replace(/(\[|\])/g, '') + ']')
}
// 4. concat
function concatFlatten(arr) {
    return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? concatFlatten(cur) : cur), [])
}
// 5. 扩展运算符
function extendFlatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr
}
let flatArr = [1, 2, 3, [4, [5]]]
console.log(flatFlatten(flatArr))
console.log(toStringFlatten(flatArr))
console.log(stringifyFlatten(flatArr))
console.log(concatFlatten(flatArr))
console.log(extendFlatten(flatArr))

////////// 数组乱序
function shuffle(arr) {
    for (let index = arr.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index - 1))
        let temp = arr[randomIndex]
        arr[randomIndex] = arr[index]
        arr[index] = temp
    }
}
const shuffleArr1 = [1, 2, 3, 4, 5, 6]
const shuffleArr2 = [1, 2, 3, 4, 5, 6]
shuffle(shuffleArr1)
shuffle(shuffleArr2)
console.log(shuffleArr1, shuffleArr2)

////////// 多层数组求和
// 1. 字符串
function toStringArrSum(array) {
    return array.toString().split(',').reduce((total, cur) => total + Number(cur), 0)
}
// 2. flat
function flatArrSum(array) {
    return array.flat(Infinity).reduce((total, cur) => total + Number(cur), 0)
}
// 3. 递归
function arrSum(array) {
    return array.reduce((total, cur) => {
        if (Array.isArray(cur)) {
            return total + arrSum(cur)
        } else {
            return total + cur
        }
    }, 0)
}

let sumArr = [1, 2, 3, [4, [5]]]
console.log(arrSum(sumArr))
console.log(toStringArrSum(sumArr))
console.log(flatArrSum(sumArr))