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