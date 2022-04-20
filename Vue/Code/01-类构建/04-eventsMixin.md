# eventsMixin

```js
export function eventsMixin(Vue) {
    const hookRE = /^hook:/
    Vue.prototype.$on = function(event, fn) {
        // ...
    }
    Vue.prototype.$once = function(event, fn) {
        // ...
    }
    Vue.prototype.$off = function(event, fn) {
        // ...
    }
    Vue.prototype.$emit = function(event) {
        // ...
    }
}
```

## `$on` 原理

1. 获取`vm._events[event]`数组，不存在的创建空数组
2. event的数组push传入的fn

```js
Vue.prototype.$on = function(event, fn) {
    const vm = this
    // 如果event是数组，则遍历每一项处理$on
    if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
            vm.$on(event[i], fn)
        }
    } else {
        // 将绑定的事件存储到vm._events中
        (vm._events[event] || (vm._events[event] = [])).push(fn)
        if (hookRE.test(event)) {
            vm._hasHookEvent = true
        }
    }
    return vm
}
```

## `$once` 原理

1. 对传入的fn进行一次封装，在执行fn之前执行vm.$off移除监听
2.  vm.$on注册封装

```js
Vue.prototype.$once = function(event, fn) {
    const vm = this
    // 创建on方法
    // 1. 移除监听
    // 2. 执行fn
    function on() {
        vm.$off(event, on)
        fn.apply(vm, arguments)
    }
    on.fn = fn
    // 向vue上注册on方法
    vm.$on(event, on)
    return vm
}
```

## `$off` 原理

1. 不传递参数则直接清空vm._events，去除所有监听
2. 不传fn，则event下的监听清空

```js
Vue.prototype.$off = function(event, fn) {
    const vm = this
    // 1. 不传递参数则直接清空监听
    if (!arguments.length) {
        vm._events = Object.create(null)
        return vm
    }
    // 2. events是Array<string>列表处理，则遍历$off处理event[i]
    if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
            vm.$off(event[i], fn)
        }
        return vm
    }
    // 3. events是string处理
    const cbs = vm._events[event]
    // 没找到直接返回
    if (!cbs) {
        return vm
    }
    // 不传fn，则event下的监听清空
    if (!fn) {
        vm._events[event] = null
        return vm
    }
    // 遍历清除每个cb中对应的fn
    let cb
    let i = cbs.length
    while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1)
            break
        }
    }
    return vm
}
```

## `$emit` 原理

1. 获取`vm._events[event]`回调数组cbs
2. 遍历执行cbs

```js
Vue.prototype.$emit = function(event) {
    const vm = this
    let cbs = vm._events[event]
    if (cbs) {
        // 将回调转化为数组
        cbs = cbs.length > 1 ? toArray(cbs) : cbs
        const args = toArray(arguments, 1)
        const info = `event handler for "${event}"`
        // 遍历执行回调
        for (let i = 0, l = cbs.length; i < l; i++) {
            invokeWithErrorHandling(cbs[i], vm, args, vm, info)
        }
    }
    return vm
}
```
