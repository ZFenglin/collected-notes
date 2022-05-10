////////// 回调函数与定时器
/**
 * requestAnimationFrame模拟定时器
 * @param {*} cb 
 * @param {*} wait 
 * @returns 
 */
function _setInterval(cb, wait) {
    let timer
    let tagTimer = Date.now()
    const loop = () => {
        timer = window.requestAnimationFrame(loop)
        if (Date.now() - tagTimer >= wait) {
            tagTimer = Date.now()
            cb(timer)
        }
    }
    loop()
    return timer
}

_setInterval((res) => console.log('tag', res), 1000)

////////// Promise

// 1. 手写Promise
class _Promise {
    static PENDING = '待定'
    static FULFILLED = '兑现'
    static REJECTED = '拒绝'
    status = _Promise.PENDING
    result = undefined
    resolveCallbacks = []
    rejectCallbacks = []

    constructor(executor) {
        const resolve = (value) => {
            setTimeout(() => {
                if (this.status === _Promise.PENDING) {
                    this.status = _Promise.FULFILLED
                    this.result = value
                    this.resolveCallbacks.forEach(cb => cb())
                }
            })
        }
        const reject = (value) => {
            setTimeout(() => {
                if (this.status === _Promise.PENDING) {
                    this.status = _Promise.REJECTED
                    this.result = value
                    this.rejectCallbacks.forEach(cb => cb())
                }
            })
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    handlePromise(fn, resolve, reject, resolved = true) {
        try {
            let x = fn(this.result)
            if (x instanceof _Promise) {
                // 处理then中返回Promise，则会执行直到then不存在为止
                x.then(resolve, reject)
            } else {
                // 当返回值不是Promise，则正常执行
                resolved ? resolve(x) : reject(x)
            }
        } catch (error) {
            reject(error)
        }
    }

    then(onResolve, onReject) {
        return new _Promise((resolve, reject) => {
            const resolveCallback = typeof onResolve === 'function' ? () => this.handlePromise(onResolve, resolve, reject, true) : () => { }
            const rejectCallback = typeof onReject === 'function' ? () => this.handlePromise(onReject, resolve, reject, false) : () => { }
            switch (this.status) {
                case _Promise.FULFILLED:
                    resolveCallback()
                    break;
                case _Promise.REJECTED:
                    rejectCallback()
                    break;
                case _Promise.PENDING:
                    this.resolveCallbacks.push(() => resolveCallback())
                    this.rejectCallbacks.push(() => rejectCallback())
                    break;
            }
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }
}

// 2. 手写Promise.all
Promise._all = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new TypeError('promise must be a array')
        }
        let count = 0
        let allRes = []
        for (let index = 0; index < promises.length; index++) {
            const promise = promises[index]
            Promise.resolve(promise).then(
                res => {
                    count++
                    allRes[index] = res
                    if (count === promises.length) {
                        return resolve(allRes)
                    }
                },
                err => {
                    return reject(err)
                }
            )
        }
    })
}

let pa1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
})
let pa2 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
})
let pa3 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
})
Promise._all([pa3, pa1, pa2]).then(res => {
    console.log(res)
})

// 3. 手写Promise.race
Promise._race = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new TypeError('promise must be a array')
        }
        for (let index = 0; index < promises.length; index++) {
            const promise = promises[index]
            Promise.resolve(promise).then(
                res => {
                    return resolve(res)
                },
                err => {
                    return reject(err)
                }
            )
        }
    })
}

let pr1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
})
let pr2 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
})
let pr3 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
})
Promise._race([pr3, pr1, pr2]).then(res => {
    console.log(res)
})


/**
 * 生成器执行器
 * @param {*} generator 
 * @returns 
 */
function co(generator) {
    const iterator = generator();
    return new Promise(function (resolve, reject) {
        // 通过递归的方式遍历内部状态
        function diff(value) {
            ret = iterator.next(value);
            if (ret.done) return resolve(ret.value);
            Promise.resolve(ret.value).then(function (data) {
                diff(data.toString())
            });
        }
        try {
            diff()
        } catch (err) {
            reject(err)
        }
    })
}

function readFile(url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, function (error, data) {
            if (error) reject(error);
            resolve(data)
        })
    })
}
function* gen() {
    var f1 = yield readFile('./a.txt');
    console.log(f1)
    var f2 = yield readFile('./b.txt');
    console.log(f2)

}
co(gen)