
/////
///// 原型方法实现
///// 
/**
 * 手写call
 * @param {Object} context 
 * @param  {...any} args 
 */
Function.prototype._call = function (context, ...args) {
    if (typeof this !== 'function') {
        throw TypeError('this must be function')
    }
    context = context || window
    context.fn = this
    let res = context.fn(...args)
    delete context.fn
    return res
}

/**
 * 手写apply
 * @param {Object} context 
 * @param {Array} args 
 */
Function.prototype._apply = function (context, args) {
    return this.call(context, ...args)
}

/**
 * 手写bind
 * @param {Object} context 
 * @param {Array} args 
 */
Function.prototype._bind = function (context, ...args) {
    if (typeof this !== 'function') {
        throw TypeError('this must be function')
    }
    let fn = this
    return function Fn() {
        // 注意，当绑定函数被new调用时，this会被变更
        context = this instanceof Fn ? this : context
        fn._apply(context, args.concat(arguments))
    }
}
