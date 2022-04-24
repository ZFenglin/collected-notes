/**
 * new实现
 * @param {function} fn 
 */
function _new(fn, ...args) {
    if (typeof fn !== 'function') {
        throw TypeError('fn is not function')
    }
    let obj = {}
    obj.__proto__ = fn.prototype
    let res = fn.apply(obj, args)
    return typeof res === 'object' ? res : obj
}
// 测试
function Preson(name) {
    this.name = name
}
Preson.prototype.sayName = function () {
    console.log('我是' + this.name)
}
let p1 = _new(Preson, 'zfl')
console.log(p1)
p1.sayName()
let p2 = new Preson('zfl')
console.log(p2)



/**
 * Object.create实现
 * @param {obj} obj 
 */
Object._create = function (obj) {
    if (typeof obj !== 'object') {
        throw TypeError('obj only be object or null')
    }
    function Fn() { }
    Fn.prototype = obj
    return new Fn()
}
// 测试
let obj = { name: 'zfl' }
let res1 = Object._create(obj)
let res2 = Object.create(obj)
console.log(res1, res2)



/**
 * instanceof实现
 * @param {*} left 
 * @param {*} right 
 */
function _instanceof(left, right) {
    let proto = Object.getPrototypeOf(left)
    const prototype = right.prototype
    while (proto) {
        if (proto === prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}
// 测试
function A() { }
const a = new A()
const b = {}
console.log(a instanceof A, b instanceof A)
console.log(a instanceof Object, b instanceof Function, A instanceof Function)
console.log(_instanceof(a, A), _instanceof(b, A))
console.log(_instanceof(a, Object), _instanceof(a, Function), _instanceof(A, Function))



/**
 * typeof实现
 * @param {*} val 
 */
function _typeOf(val) {
    if (val === null) return 'object'
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}
// 测试
console.log(_typeOf(null), typeof null)
console.log(_typeOf(undefined), typeof undefined)
console.log(_typeOf({}), typeof {})
console.log(_typeOf(1), typeof 1)
console.log(_typeOf('1'), typeof '1')
console.log(_typeOf(true), typeof true)
console.log(_typeOf(() => { }), typeof (() => { }))