
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



/////
///// 闭包应用
///// 
/**
 * 模块化
 */
var foo = (function CoolModule(id) {
    function change() {
        // 修改公共 API
        publicAPI.identify = identify2;
    }

    function identify1() {
        console.log(id);
    }

    function identify2() {
        console.log(id.toUpperCase());
    }
    var publicAPI = {
        change: change,
        identify: identify1
    };
    return publicAPI;
})("foo module");
foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODUL


/**
 * 柯里化
 */
function curry(fn, args) {
    // 获取函数需要的参数长度
    let length = fn.length;
    args = args || [];
    return function () {
        let subArgs = args.slice(0);
        // 拼接得到现有的所有参数
        for (let i = 0; i < arguments.length; i++) {
            subArgs.push(arguments[i]);
        }
        // 判断参数的长度是否已经满足函数所需参数的长度
        if (subArgs.length >= length) {
            // 如果满足，执行函数
            return fn.apply(this, subArgs);
        } else {
            // 如果不满足，递归返回科里化的函数，等待参数的传入
            return curry.call(this, fn, subArgs);
        }
    };
}
// ES6简化调用
function curry(fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}


/**
 * 防抖和节流
 */
// 1. 函数防抖的实现
function debounce(fn, wait) {
    let timer = null;
    return function () {
        let context = this,
            args = arguments;
        // 如果此时存在定时器的话，则取消之前的定时器重新记时
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        // 设置定时器，使事件间隔指定事件后执行
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, wait);
    };
}

// 2. 函数节流的实现
function throttle(fn, delay) {
    let curTime = Date.now();
    return function () {
        let context = this,
            args = arguments,
            nowTime = Date.now();
        // 如果两次时间间隔超过了指定时间，则执行函数。
        if (nowTime - curTime >= delay) {
            curTime = Date.now();
            return fn.apply(context, args);
        }
    };
}
