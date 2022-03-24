# initMixin
1. 相关标识属性添加
2. options配置处理
3. 实例初始化处理
4. 组件挂载

```JS
export function initMixin(Vue) {
    //  Vue.prototype._init属性添加
    Vue.prototype._init = function(options) {
        const vm = this
        // 1. 标识_uid和标识为Vue实例，是不会被观测的
        vm._uid = uid++
        // ...
        vm._isVue = true
        // 2. options处理
        if (options && options._isComponent) {
            // 如果是组件，则会对组件配置进处理
            initInternalComponent(vm, options)
        } else {
            // Vue.options 和自己的属性合并
            vm.$options = mergeOptions(
                resolveConstructorOptions(vm.constructor),
                options || {},
                vm
            )
        }
        // ...
        // 3. 初始化处理
        vm._self = vm
        initLifecycle(vm)
        initEvents(vm)
        initRender(vm)
        callHook(vm, 'beforeCreate')
        initInjections(vm)
        initState(vm)
        initProvide(vm)
        callHook(vm, 'created')
        // ...
        // 4. 组件挂载
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}
```

## initLifecycle

寻找不是抽象组件的父组件，给父组件添加$children，并设置当前组件的$parent和$root

```JS
export function initLifecycle(vm) {
    const options = vm.$options
    let parent = options.parent
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent
        }
        // $children添加
        parent.$children.push(vm)
    }
    // $parents设置
    vm.$parent = parent
    // $root设置
    vm.$root = parent ? parent.$root : vm
    // 其他属性初始化
    // ...
}
```

## initEvents

处理组件间事件的发布订阅

```JS
export function initEvents(vm) {
    // 当前实例创建_events，作为发布订阅的收集
    vm._events = Object.create(null)
    vm._hasHookEvent = false
    // 初始化parent连接时间
    const listeners = vm.$options._parentListeners
    if (listeners) {
        updateComponentListeners(vm, listeners)
    }
}
```

## initRender

1. 初始化插槽
2. _c和$createElement（内部编译使用_c，外部编译使用$createElement）
3. $attrs和$listeners

```JS
export function initRender(vm) {
    // 相关属性初始化
    // ....
    // vm.$scopedSlots和 vm.$slots设置
    vm.$slots = resolveSlots(options._renderChildren, renderContext)
    vm.$scopedSlots = emptyObject
    // vm._c和vm.$createElement设置
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
    const parentData = parentVnode && parentVnode.data
    // 定义$attrs和$listeners
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}
```

## initInjections

inject处理，隔代传输数据，不建议开发使用，因为值不清楚由谁提供

```JS
export function initInjections(vm) {
    const result = resolveInject(vm.$options.inject, vm)
    if (result) {
        // 数据观测开关关闭
        toggleObserving(false)
        /// 将当前获取到的Inject定义到当前实例上
        Object.keys(result).forEach(key => {
            // ...
            defineReactive(vm, key, result[key])
        })
        // 数据观测开关开启
        toggleObserving(true)
    }
}
```

inject的获取就是不断访问当前实例上的$parent，直到实例的provider有inject对应的key

```JS
export function resolveInject(inject, vm) {
    if (inject) {
        const result = Object.create(null)
        // 获取inject的keys
        const keys = hasSymbol ?
            Reflect.ownKeys(inject) :
            Object.keys(inject)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (key === '__ob__') continue
            const provideKey = inject[key].from
            let source = vm
            // 不停往上查找source的祖先中的provider，直到找到为止
            while (source) {
                if (source._provided && hasOwn(source._provided, provideKey)) {
                    result[key] = source._provided[provideKey]
                    break
                }
                source = source.$parent
            }
            if (!source) {
                // 未找到处理
                // ...
            }
        }
        return result
    }
}
```

## initState

判断vue的options是否存在对应的属性，决定是否进行相关处理

```JS
export function initState(vm) {
    // 收集当前实例上的所有watcher，用于$forceUpdate使用
    vm._watchers = []
    const opts = vm.$options
    // 组件的属性原理 vm._props
    if (opts.props) initProps(vm, opts.props)
    // 将方所有的方法定义在vm._methods上，并且把方法的this指向当前实例
    if (opts.methods) initMethods(vm, opts.methods)
    // data数据初始化
    if (opts.data) {
        initData(vm)
    } else {
        observe(vm._data = {}, true)
    }
    // computed初始化处理
    if (opts.computed) initComputed(vm, opts.computed)
    // watch初始化处理
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
    }
}
```

### initProps

props初始化，在当前实例的_props上设置传入值

```JS
function initProps(vm, propsOptions) {
    const propsData = vm.$options.propsData || {}
    // vm._props用于接收对应对象
    const props = vm._props = {}
    const keys = vm.$options._propKeys = []
    const isRoot = !vm.$parent
    if (!isRoot) {
        // 如果是根节点，则关闭数据监听
        toggleObserving(false)
    }
    for (const key in propsOptions) {
        keys.push(key)
        // 获取校验过的value
        const value = validateProp(key, propsOptions, propsData, vm)
        // 将对应的value和key定义到props上
        defineReactive(props, key, value)
        // 代理_props属性值vue实例上
        if (!(key in vm)) {
            proxy(vm, `_props`, key)
        }
    }
    // 开启数据监听
    toggleObserving(true)
}
```

### initMethods

获取methods绑定this至vm的处理函数，将函数赋值到vm对应的key上

```JS
function initMethods(vm, methods) {
    for (const key in methods) {
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
    }
}
```

### initData、initComputed 和 initWatch

详细见响应式原理中的响应式原理和computed和watch

## initProvide

简单处理provider赋值，如果是function则获取执行结果，将值设置到vm._provided上

此处可以看出provider并不是响应式的数据

```JS
export function initProvide(vm) {
    const provide = vm.$options.provide
    if (provide) {
        vm._provided = typeof provide === 'function' ?
            provide.call(vm) :
            provide
    }
}
```
