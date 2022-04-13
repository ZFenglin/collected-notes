# computed和watch

watch只是一种用户自定义的watcher，当数据变化后，将触发传入的cb

computed是懒加载的watcher，只有对应值变化后才会处理新值获取

## watch

watch的处理只是在当前的实例上利用$watch创建新的watcher

initWatch：按照不同的handler，处理后调用createWatcher创建对应watcher
createWatcher： 利用$watch创建watcher

```js
function initWatch(vm, watch) {
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(
    vm,
    expOrFn,
    handler,
    options
) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    // $watch创建的watcher都是用户自定义的
    return vm.$watch(expOrFn, handler, options)
}
```

## computed

### computed初始化

遍历computed，对每一项进行处理并创建对应的lazy形式Watcher和定义属性至vm上

同时还会收集当前实例的所有computed产生的watcher，用于在get触发时获取对应watcher并更新

```js
const computedWatcherOptions = {
    lazy: true
}

function initComputed(vm, computed) {
    // 收集当前实例的所有computed产生的watcher，用于在get触发时获取对应watcher并更新
    const watchers = vm._computedWatchers = Object.create(null)
    const isSSR = isServerRendering()
    for (const key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        if (!isSSR) {
            // 创建对应的lazy形式Watcher
            watchers[key] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions
            )
        }
        // 定义属性至vm
        if (!(key in vm)) {
            defineComputed(vm, key, userDef)
        }
    }
}
```

### computed定义

defineComputed
1. 按照用户定义方式决定如何处理获取get
2. 利用Object.defineProperty将对应的computed定义到vm上

createComputedGetter用于创建computed使用的get
1. 获取key对应watcher
2. 判断是否时脏数据，从而决定是否执行evaluate更新
3. 判断target是存在，进行depend收集处理

```js
export function defineComputed(
    target,
    key,
    userDef
) {
    const shouldCache = !isServerRendering()
    // 按照用户定义方式决定如何处理获取get
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache ?
            createComputedGetter(key) :
            createGetterInvoker(userDef)
        sharedPropertyDefinition.set = noop
    } else {
        sharedPropertyDefinition.get = userDef.get ?
            shouldCache && userDef.cache !== false ?
            createComputedGetter(key) :
            createGetterInvoker(userDef.get) :
            noop
        sharedPropertyDefinition.set = userDef.set || noop
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
    return function computedGetter() {
        // 获取key对应watcher
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            //  判断是否时脏数据，从而决定是否执行evaluate更新
            if (watcher.dirty) {
                watcher.evaluate()
            }
            // 判断target是存在，进行depend收集处理
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}

function createGetterInvoker(fn) {
    return function computedGetter() {
        return fn.call(this, this)
    }
}
```
