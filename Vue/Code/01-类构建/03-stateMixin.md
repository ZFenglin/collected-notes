# stateMixin
1. $data和$props设置
2. $set和$delete设置
3. $watch设置

```js
export function stateMixin(Vue) {
    // $data和$props设置
    // ...
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)
    // $set和$delete设置
    Vue.prototype.$set = set
    Vue.prototype.$delete = del
    // $watch设置
    Vue.prototype.$watch = function(expOrFn, cb, options) {
        // ...
    }
}
```

## $data和$props设置

简单将this._data和this._props设置为get并定义到Vue.prototype上

```js
const dataDef = {}
dataDef.get = function() {
    return this._data
}
const propsDef = {}
propsDef.get = function() {
    return this._props
}
Object.defineProperty(Vue.prototype, '$data', dataDef)
Object.defineProperty(Vue.prototype, '$props', propsDef)
```

## $set原理

1. 如果是数组，则直接执行splice方法处理
2. 如果是对象，先过滤不需要定义新属性的情形，否则使用defineReactive定义新值至ob.value，并通知更新

```js
export function set(target, key, val) {
    // 如果是数组，则直接执行splice方法处理
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    // 如果为对象
    // 1. key存在，更新值
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target).__ob__
    // 2. 如果修改是vue实例，则报错跳过
    if (target._isVue || (ob && ob.vmCount)) {
        return val
    }
    // 3. 如果不是响应式对象，直接赋值
    if (!ob) {
        target[key] = val
        return val
    }
    // 4. 定义新响应式对象
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}
```

## $delete原理

1. 如果是数组，则直接执行splice方法处理
2. 如果是对象，先过滤异常和不存在情况，否则使用delete删除属性，并通知更新

```js
export function del(target, key) {
    // 如果是数组，则直接执行splice方法处理
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1)
        return
    }
    // 如果为对象
    const ob = (target).__ob__
    // 1. 如果修改是vue实例，则报错跳过
    if (target._isVue || (ob && ob.vmCount)) {
        return
    }
    // 2. 不存在对应key值，直接返回
    if (!hasOwn(target, key)) {
        return
    }
    // 3. delete删除属性，并触发更新
    delete target[key]
    if (!ob) {
        return
    }
    ob.dep.notify()
}
```

##  $watch原理

创建对应Watcher，同时返回对应watcher实例的销毁方法

```js
Vue.prototype.$watch = function(expOrFn, cb, options) {
    const vm = this
    // 如果回调为空，则直接创建默认Watcher
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
    }
    // 用户自定义watcher创建
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    // 如果immediate，则立即执行一次
    if (options.immediate) {
        const info = `callback for immediate watcher "${watcher.expression}"`
        pushTarget()
        invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
        popTarget()
    }
    // 返回清除当前watcher方法
    return function unwatchFn() {
        watcher.teardown()
    }
}
```
