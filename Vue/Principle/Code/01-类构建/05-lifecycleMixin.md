# lifecycleMixin

```js
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode, hydrating) {
        // ...
    }

    Vue.prototype.$forceUpdate = function() {
        // ...
    }

    Vue.prototype.$destroy = function() {
        // ...
    }
}
```

## `_update` 原理

1. vue内部使用，用于处理实例渲染更新方法
2. prevVnode是否存在决定是执行初次渲染，还是更新渲染
3. 挂载虚拟节点时，_update(_render())为挂载Vue核心

```js
Vue.prototype._update = function(vnode, hydrating) {
    const vm = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    // ...
    vm._vnode = vnode
    // prevVnode用于判断时首次渲染还是更新渲染
    if (!prevVnode) {
        // initial render 初次渲染
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */ )
    } else {
        // updates 更新渲染
        vm.$el = vm.__patch__(prevVnode, vnode)
    }
    // ...
    // 更新__vue__引用
    // ...
    // 父元素是高阶组件，自己变动了父元素也更新$el
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el
    }
}
```

1. 而执行真正执行挂载更新的是__patch__方法
2. patch的挂载则是在公共mount声明之前，patch相关请见[Vue/编译与挂载/元素patch处理](../03-编译与挂载/07-元素patch处理.md)

## `$forceUpdate` 原理

获取当前实例的_watcher，并调用其update

```js
Vue.prototype.$forceUpdate = function() {
    const vm = this
    if (vm._watcher) {
        vm._watcher.update()
    }
}
```

## $destroy原理

1. 判断拦截重复处理
2. callHook(vm, 'beforeDestroy')
3. 从父组件中移除自身
4. 移除watcher监听
5. 渲染树清空
6. callHook(vm, 'destroyed')
7. 移除`$el.__vue__` 引用
8. 清空虚拟节点的parent

```js
Vue.prototype.$destroy = function() {
    const vm = this
    // 拦截重复处理
    if (vm._isBeingDestroyed) {
        return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // 从父组件中移除自身
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm)
    }
    // 移除watcher监听
    if (vm._watcher) {
        vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
        vm._watchers[i].teardown()
    }
    // vmCount减一
    if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--
    }
    vm._isDestroyed = true
    // 渲染树清空
    vm.__patch__(vm._vnode, null)
    callHook(vm, 'destroyed')
    // 移除组件监听
    vm.$off()
    // 移除 __vue__ 引用
    if (vm.$el) {
        vm.$el.__vue__ = null
    }
    // 清空虚拟节点的parent
    if (vm.$vnode) {
        vm.$vnode.parent = null
    }
}
```
