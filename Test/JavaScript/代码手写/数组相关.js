////////// 原型方法实现
/**
 * 手写flat
 * @param {*} depth 
 */
Array.prototype._flat = function (depth = 1) {
    if (depth <= 0 || !Array.isArray(this)) return this
    return this.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? Array.prototype._flat.call(cur, depth - 1) : cur), [])
}
const arr = [1, 1, [2, [3]]]
console.log(arr._flat())
console.log(arr._flat(2))
console.log(arr._flat(3))