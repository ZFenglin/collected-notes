# vnode生成

render代码生成后，执行得到vnode

## 执行代码设置

1. _c是执行initMixin中的initRender时处理，详见[Vue/Code/类构建/initMixin](../01-类构建/02-initMixin.md)
2. 其他的则是在renderMixin中installRenderHelpers设置，详见[Vue/Code/类构建/renderMixin](../01-类构建/06-renderMixin.md)

```js
export function initRender(vm) {
    // ...
    // vm._c和vm.$createElement设置
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    // ...
}
```

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

## Vnode创建

### createElement

1. createElement处理传入参数
2. 执行_createElement创建Vnode

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

### _createElement

1. 异常拦截，返回空Vnode
   1. observed的data对象拦截
   2. tag获取和异常拦截
2. vnode创建
   1. tag为字符串
      1. 正常节点直接创建新的VNode实例
      2. 组件调用createComponent创建
      3. 其他的也是创建新的VNode实例
   2. tag为函数，则是组件，直接执行createComponent
3. vnode返回判断

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
        //...
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
