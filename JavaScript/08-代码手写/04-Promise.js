/**
 * 手写promise
 */
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
            });
        }
        const reject = (value) => {
            setTimeout(() => {
                if (this.status === _Promise.PENDING) {
                    this.status = _Promise.REJECTED
                    this.result = value
                    this.rejectCallbacks.forEach(cb => cb())
                }
            });
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
                x.then(resolve, reject)
            } else {
                resolved ? resolve(x) : reject(x)
            }
        } catch (error) {
            reject(error)
        }
    }

    then(onResolved, onRejected) {
        return new _Promise((resolve, reject) => {
            let resolvedFn = typeof onResolved === 'function' ? () => this.handlePromise(onResolved, resolve, reject, true) : () => { }
            let rejectedFn = typeof onRejected === 'function' ? () => this.handlePromise(onRejected, resolve, reject, false) : () => { }
            switch (this.status) {
                case _Promise.FULFILLED:
                    resolvedFn()
                    break;
                case _Promise.REJECTED:
                    rejectedFn()
                    break;
                case _Promise.PENDING:
                    this.resolveCallbacks.push(() => resolvedFn())
                    this.rejectCallbacks.push(() => rejectedFn())
                    break;
            }
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }
}
// console.log('1')
// let p = new _Promise(function (resolve, reject) {
//     console.log('2')
//     setTimeout(() => {
//         resolve('zfl')
//         console.log('4')
//     }, 1000);
// })

// p.then(
//     res => {
//         console.log('resolve:' + res)
//         return '123'
//     },
//     res => { console.log('reject:' + res) }
// ).then(
//     res => {
//         console.log('resolve2:' + res)
//     },
//     res => { console.log('reject2:' + res) }
// )
// console.log('3')

/**
 * 手写Promise.all
 */
function promiseAll(promises) {
    return new Promise(function (resolve, reject) {
        // 类型判断
        if (!Array.isArray(promises)) {
            throw new TypeError('promise must be a array')
        }
        let count = 0
        let length = promises.length
        let promisesResults = []
        for (let index = 0; index < length; index++) {
            // 用Promise.resolve包裹传入promise参数，防止传入普通函数报错
            const promise = promises[index];
            Promise.resolve(promise).then(
                res => {
                    count++
                    promisesResults[index] = res
                    if (count === length) {
                        return resolve(promisesResults)
                    }
                },
                res => {
                    return reject(res)
                },
            )
        }
    })
}
// let p1 = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         resolve(1)
//     }, 1000)
// })
// let p2 = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         resolve(2)
//     }, 2000)
// })
// let p3 = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         resolve(3)
//     }, 3000)
// })
// promiseAll([p3, p1, p2]).then(res => {
//     console.log(res) // [3, 1, 2]
// })

/**
 * 手写Promise.race
 */
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        // 类型判断
        if (!Array.isArray(promises)) {
            throw new TypeError('promise must be a array')
        }
        for (let index = 0; index < promises.length; index++) {
            const promise = promises[index];
            Promise.resolve(promise).then(
                res => {
                    return resolve(res)
                },
                res => {
                    return reject(res)
                },
            )
        }
    })
}
// let p1 = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         resolve(1)
//     }, 1000)
// })
// let p2 = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         resolve(2)
//     }, 2000)
// })
// let p3 = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         resolve(3)
//     }, 3000)
// })
// promiseRace([p3, p1, p2]).then(res => {
//     console.log(res) // [3, 1, 2]
// })