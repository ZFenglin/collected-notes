# Promise

## Promise概念

### 三个状态

1. pending（待定）
2. fullfilled（兑现，也有resolved）
3. rejected（拒绝）

### 两个过程

pending => resolve（触发onFulfilled）
pending => rejected（触发onRejected）

1. 变化不可逆
2. 结果事件将会放在微任务队列中等待执行

## Promise方法

### 构造函数

#### Promise()

创建一个新的promise对象

### 实例方法(Promise.prototype)

#### .then

resovle触发的回调

1. then会返回一个全新的Promise对象
2. then方法就是为上一个then返回Promise注册回调
3. then的返回值会作为后续的then方法的回调参数

#### .catch

reject触发的回调，或者执行代码异常也会触发

#### .finally

resolve和reject都会触发

### 静态方法(Promise)

#### Promise.all(iterable)

所有的promise对象都成功，则触发成功，返回结果数组

任何一个promise对象失败，触发失败，返回第一个错误

##### 手写Promise.all(iterable)

```JS
function promiseAll(promises) {
    return new Promise(function(resolve, reject) {
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
```

#### Promise.allSettled(iterable)

所有promises都已敲定，无论错误失败都返回结果数组

#### Promise.any(iterable)

任何一个promise对象成功，返回第一个成功对象结果

#### Promise.race(iterable)

任何一个promise对象成功或失败，返回第一个失败或成功对象结果

#### 手写Promise.race

```JS
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
```

#### Promise.race实现执行中断

Promise执行是不可以中断的，可以利用Promise.race实现伪中断

```JS
Promise.race([promise1, timeOutPromise(5000)]).then(res => {})
```

#### Promise.reject(reason)

返回一个状态为失败的promise对象

#### Promise.resolve(value)

返回一个状态由给定value决定的promise对象

1. value为带有then方法的对象：返回的Promise对象的最终状态由then方法执行决定
2. value为其他：返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法

## 链式调用

![Promise执行过程](assets/02-Promises执行过程.png)

### Promise执行方法判断

首先按照Promise的状态（resolved或rejected）触发then或者catch

then和catch后续触发则是按照以下情况

1. 当没有设定状态时，默认状态是resolved，触发最近的then
2. 当内部报错时，默认状态为rejected，触发最近的catch

### [执行顺序判断](https://juejin.cn/post/6844903987183894535)

1. 微任务回调事件按照注册顺序执行
2. 任何一个异常都会不断向后执行直到捕获

#### then与catch的注册时机

```JS
// 所有then同时注册
// 1. 先创建Promise实例
let p = new Promise()
p.then(() {})
p.then(() {})
// 2. return直接返回Promise实例
return new Promise().then(() {}).then(() {})

// 按照回调执行后注册
// 会等待第一个then执行完后再注册第二个
new Promise().then(() {}).then(() {})
```

## 手写Promise

1. 利用数组保存回调
2. 在下一个循环执行resolve和reject
3. 按照执行结果是否instanceof _Promise，决定是否继续执行then
4. then返回一个_Promise对象
5. catch返回一个只注册onRejected的then的执行结果

```JS
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
            let resolvedFn = typeof onResolved === 'function' ? () => this.handlePromise(onResolved, resolve, reject, true) : () => {}
            let rejectedFn = typeof onRejected === 'function' ? () => this.handlePromise(onRejected, resolve, reject, false) : () => {}
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

    catch (onRejected) {
        return this.then(null, onRejected)
    }
}
```
