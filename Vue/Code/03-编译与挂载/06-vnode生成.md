# vnode生成

render代码生成后，执行得到vnode

## 执行代码设置

_c是执行initMixin中的initRender时处理

```js
export function initRender(vm) {
    // ...
    // vm._c和vm.$createElement设置
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    // ...
}
```

而其他的则是在renderMixin中installRenderHelpers设置

```js
export function installRenderHelpers(target: any) {
    target._o = markOnce
    target._n = toNumber
    target._s = toString
    target._l = renderList
    target._t = renderSlot
    // ...
}
```

这里我们只详细介绍createElement的执行

## createElement

```js
export function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }
    return _createElement(context, tag, data, children, normalizationType)
}
```

_createElement正真负责vnode创建

```js
export function _createElement(context, tag, data, children, normalizationType) {
    // observed的data对象拦截
    if (isDef(data) && isDef((data).__ob__)) {
        return createEmptyVNode()
    }
    // ...
    if (!tag) {
        // tag获取和异常拦截
        return createEmptyVNode()
    }
    // ...
    // children 的规范化处理成Vnode
    // ...
    // VNode 的创建
    let vnode, ns
    if (typeof tag === 'string') {
        let Ctor
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
        if (config.isReservedTag(tag)) {
            // 普通标签vnode创建
            vnode = new VNode(
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
            )
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            // 组件vnode创建
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            // 其它标签vndoe创建
            vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
            )
        }
    } else {
        // tag不是string，则就是组件的构造函数直接执行createComponent
        vnode = createComponent(tag, data, context, children)
    }
    // vnode返回判断
    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        if (isDef(ns)) applyNS(vnode, ns)
        if (isDef(data)) registerDeepBindings(data)
        return vnode
    } else {
        return createEmptyVNode()
    }
}
```

## Vnode

Vue.js 中 Virtual DOM 是借鉴了一个开源库 snabbdom，并增加了Vue的一些特殊属性

```js
export default class VNode {
    // ...
    constructor(
        tag,
        data,
        children,
        text,
        elm,
        context,
        componentOptions,
        asyncFactory
    ) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.ns = undefined
        this.context = context
        this.fnContext = undefined
        this.fnOptions = undefined
        this.fnScopeId = undefined
        this.key = data && data.key
        this.componentOptions = componentOptions
        this.componentInstance = undefined
        this.parent = undefined
        this.raw = false
        this.isStatic = false
        this.isRootInsert = true
        this.isComment = false
        this.isCloned = false
        this.isOnce = false
        this.asyncFactory = asyncFactory
        this.asyncMeta = undefined
        this.isAsyncPlaceholder = false
    }
    get child(): Component | void {
        return this.componentInstance
    }
}
```
