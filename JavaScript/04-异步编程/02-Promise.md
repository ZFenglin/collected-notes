# Promise

## Promise概念

### 三个状态

1. pending（待定）
2. fullfilled（兑现，也有resolved）
3. rejected（拒绝）

### 两个过程

1. pending => resolve（触发onFulfilled）
2. pending => rejected（触发onRejected）

#### 过程特点

3. 变化不可逆
4. 结果事件将会放在微任务队列中等待执行

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

##### Promise.all原理

1. 返回一个Promise
   1. 维护一个结果数组promisesResults
   2. 遍历promises，Promise.resolve(promise)封装，在then时处理成功和失败
      1. 成功时，看promisesResults的长度，判断是否完全处理完，看是否触发resolve(promisesResults)
      2. 失败直接reject(res)

详见手写代码/异步编程

#### Promise.allSettled(iterable)

所有promises都已敲定，无论错误失败都返回结果数组

#### Promise.any(iterable)

任何一个promise对象成功，返回第一个成功对象结果

#### Promise.race(iterable)

任何一个promise对象成功或失败，返回第一个失败或成功对象结果

##### Promise.race原理

1. 与Promise.all差不多，Promise.resolve(promise)外部差不多，没有需要维护的数组
2. then内部则是谁先触发谁resolve(res)或reject(res)

详见手写代码/异步编程

##### Promise.race实现执行中断

Promise执行是不可以中断的，可以利用Promise.race实现伪中断

```js
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

```js
// 所有then同时注册
// 1. 先创建Promise实例
let p = new Promise()
p.then(() {})
p.then(() {})
// 2. return直接返回Promise实例
return new Promise().then(() {}).then(() {})
```

```js
// 按照回调执行后注册
// 会等待第一个then执行完后再注册第二个
new Promise().then(() {}).then(() {})
```

## Promise原理

详见手写代码/异步编程

1. 利用数组保存回调resolveCallbacks与rejectCallbacks
2. 在下一个循环执行resolve和reject
3. 按照执行结果是否instanceof _Promise，决定是否继续执行then
4. then返回一个_Promise对象，并且then需要具有承前启后的作用
   1. 承前：前一个promise完成后，调用resolve变更状态，并且resolve会依次调用callbacks里的回调
   2. 启后：如果返回值不是Promise，则直接执行resolve或reject结束Promise，否则处理结果的then
5. catch返回一个只注册onRejected的then的执行结果
