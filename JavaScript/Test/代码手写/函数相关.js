////////// 原型方法实现
/**
 * 手写call
 * @param {Object} context 
 * @param  {...any} args 
 * @returns 
 */
Function.prototype._call = function (context, ...args) {
    if (typeof this !== 'function') {
        throw 'this must be function'
    }
    context.fn = this
    const res = context.fn(...args)
    delete context.fn
    return res
}

/**
 * 手写apply
 * @param {Object} context 
 * @param {Array} args 
 * @returns 
 */
Function.prototype._apply = function (context, args) {
    return this._call(context, ...args)
}

/**
 * 手写bind
 * @param {*} context 
 * @param  {...any} args 
 * @returns 
 */
Function.prototype._bind = function (context, ...args) {
    if (typeof this !== 'function') {
        throw 'this must be function'
    }
    const fn = this
    return function Fn() {
        context = this instanceof Fn ? this : context
        fn._apply(context, args.concat(...arguments))
    }
}

function sayName(age, sex) {
    console.log(this.name, age, sex)
}

let p = {
    name: 'zfl'
}
sayName._call(p, 26, 'man')
sayName._apply(p, [26, 'man'])
const fn = sayName._bind(p, 26)
fn('man')

//////////  闭包
// 1. 模块化
const mp = (function ModulePerson(name) {
    let age = 0
    function growth() {
        age++
    }
    function sayAge() {
        console.log(name + ' is ' + age)
    }
    return {
        growth,
        sayAge
    }
})('zfl')
mp.sayAge()
mp.growth()
mp.sayAge()

// 2. 柯里化
function curry() {
    const fn = arguments[0]
    const args = Array.prototype.slice.call(arguments, 1) || []
    return function () {
        const subArgs = args.slice(0)
        for (let index = 0; index < arguments.length; index++) {
            subArgs.push(arguments[index])
        }
        if (fn.length <= subArgs.length) {
            return fn.apply(this, subArgs)
        } else {
            subArgs.unshift(fn)
            return curry.apply(this, subArgs)
        }
    }
}

function curryES6(fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args)
}

function sum(a, b, c) {
    console.log(a + b + c)
}
const currySum = curry(sum, 1)
const twoCurrySum = currySum(2)
twoCurrySum(3)

// 防抖和节流
function debounce(fn, wait) {
    let timer = null
    return function () {
        const context = this
        const args = arguments
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, wait)
    }
}
function throttle(fn, wait) {
    let tagTime = Date.now()
    return function () {
        const context = this
        const args = arguments
        const runTime = Date.now()
        if (runTime - tagTime >= wait) {
            tagTime = Date.now()
            fn.apply(context, args)
        }
    }
}

function scrollEvent(type) {
    console.log('scrollEvent', type)
}
document.addEventListener('scroll', debounce(() => scrollEvent('debounce'), 1000))
document.addEventListener('scroll', throttle(() => scrollEvent('throttle'), 1000))