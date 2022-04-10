# renderMixin
1. 安装渲染函数helpers处理
2. $nextTick
3. _render

```JS
export function renderMixin(Vue) {
    // 安装渲染函数helpers处理
    installRenderHelpers(Vue.prototype)
    // $nextTick
    Vue.prototype.$nextTick = function(fn) {
        return nextTick(fn, this)
    }
    // _render
    Vue.prototype._render = function() {
        // ...
    }
}
```

## installRenderHelpers原理

将处理各种标签渲染的方法添加至Vue.prototype，供后续render方法执行时使用

```JS
export function installRenderHelpers(target: any) {
    target._o = markOnce
    target._n = toNumber
    target._s = toString
    target._l = renderList
    target._t = renderSlot
    target._q = looseEqual
    target._i = looseIndexOf
    target._m = renderStatic
    target._f = resolveFilter
    target._k = checkKeyCodes
    target._b = bindObjectProps
    target._v = createTextVNode
    target._e = createEmptyVNode
    target._u = resolveScopedSlots
    target._g = bindObjectListeners
    target._d = bindDynamicKeys
    target._p = prependModifier
}
```

## $nextTick原理

用于处理实例异步更新后执行的方法

```JS
Vue.prototype.$nextTick = function(fn: Function) {
    return nextTick(fn, this)
}
```

nextTick见响应式原理的异步更新

## _render原理

vnode相关属性设置和render函数的执行

```JS
Vue.prototype._render = function() {
    const vm = this
    const {
        render,
        _parentVnode
    } = vm.$options
    // 处理作用域插槽
    if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
            _parentVnode.data.scopedSlots,
            vm.$slots,
            vm.$scopedSlots
        )
    }
    // $vnode设置
    vm.$vnode = _parentVnode
    // 执行render函数
    let vnode
    try {
        currentRenderingInstance = vm
        vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
        handleError(e, vm, `render`)
        vnode = vm._vnode
    } finally {
        currentRenderingInstance = null
    }
    // 返回的数组只有一项，则直接设置该项
    if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0]
    }
    // vnode不正确，则设置空节点
    if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode()
    }
    // 设置parent
    vnode.parent = _parentVnode // vm.$vnode = _parentVnode = vnode.parent
    return vnode
}
```
