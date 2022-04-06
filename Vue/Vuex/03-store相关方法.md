# store相关方法

在store中或者其它地方使用到的相关处理方法，这里只解释比较重要的部分

1. 生成订阅
2. 重置处理
3. 模块注册
7. vuex安装（install的时候介绍过了）

```JS
// 生成订阅
function genericSubscribe(fn, subs, options) {}
// 重置处理
function resetStore(store, hot) {}

function resetStoreVM(store, state, hot) {}
// 模块注册
function installModule(store, rootState, path, module, hot) {}
// ...
// vuex安装
export function install(_Vue) {}
```

## 生成订阅

genericSubscribe在store实例的监听处理中使用

```JS
function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
        options && options.prepend ?
            subs.unshift(fn) :
            subs.push(fn)
    }
    return () => {
        const i = subs.indexOf(fn)
        if (i > -1) {
            subs.splice(i, 1)
        }
    }
}
```

## 重置处理

resetStore用于重置当前的store

```JS
function resetStore(store, hot) {
    store._actions = Object.create(null)
    store._mutations = Object.create(null)
    store._wrappedGetters = Object.create(null)
    store._modulesNamespaceMap = Object.create(null)
    const state = store.state
    installModule(store, state, [], store._modules.root, true)
    resetStoreVM(store, state, hot)
}
```

resetStoreVM用于重置store处理的vm实例
1. 相关属性声明和computed创建
2. 创建新实例vm接收data和computed
3. 严格模式启动
4. 旧实例销毁

```JS
function resetStoreVM(store, state, hot) {
    // 相关属性声明和computed创建
    const oldVm = store._vm
    store.getters = {}
    store._makeLocalGettersCache = Object.create(null)
    const wrappedGetters = store._wrappedGetters
    const computed = {}
    forEachValue(wrappedGetters, (fn, key) => {
        computed[key] = partial(fn, store)
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key],
            enumerable: true
        })
    })
    //  ...
    // 创建新实例vm接收data和computed
    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    })
    // 严格模式启动
    if (store.strict) {
        enableStrictMode(store)
    }
    // 旧实例销毁
    if (oldVm) {
        if (hot) {
            store._withCommit(() => {
                oldVm._data.$$state = null
            })
        }
        Vue.nextTick(() => oldVm.$destroy())
    }
}
```

### 严格模式启动

利用vm的watch监听this._data.$$state的变化

```JS
function enableStrictMode(store) {
    store._vm.$watch(function() {
        return this._data.$$state
    }, () => {
        if (__DEV__) {
            assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
        }
    }, {
        deep: true,
        sync: true
    })
}
```

## 模块注册

installModule的constructor上用于初始化根模块

```JS
function installModule(store, rootState, path, module, hot) {
    // 判断是否是根元素
    const isRoot = !path.length
    // 获取namespace分割好的名字
    const namespace = store._modules.getNamespace(path)
    if (module.namespaced) {
        store._modulesNamespaceMap[namespace] = module
    }
    // 设置子状态
    if (!isRoot && !hot) {
        // 获取parentState状态
        const parentState = getNestedState(rootState, path.slice(0, -1))
        const moduleName = path[path.length - 1]
        // 向parentState添加key为moduleName值为module.state的响应式属性
        store._withCommit(() => {
            Vue.set(parentState, moduleName, module.state)
        })
    }
    const local = module.context = makeLocalContext(store, namespace, path)
    // 增加对应模块的方法和子模块
    module.forEachMutation((mutation, key) => {
        const namespacedType = namespace + key
        registerMutation(store, namespacedType, mutation, local)
    })
    module.forEachAction((action, key) => {
        const type = action.root ? key : namespace + key
        const handler = action.handler || action
        registerAction(store, type, handler, local)
    })
    module.forEachGetter((getter, key) => {
        const namespacedType = namespace + key
        registerGetter(store, namespacedType, getter, local)
    })
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child, hot)
    })
}
```

### 按照路径获取最新的state

```JS
function getNestedState(state, path) {
    return path.reduce((state, key) => state[key], state)
}
```

### 注册属性

用于注册模块时处理模块里面的Mutation、Action和Getter

```JS
function registerMutation(store, type, handler, local) {
    const entry = store._mutations[type] || (store._mutations[type] = [])
    entry.push(function wrappedMutationHandler(payload) {
        handler.call(store, local.state, payload)
    })
}

function registerAction(store, type, handler, local) {
    const entry = store._actions[type] || (store._actions[type] = [])
    entry.push(function wrappedActionHandler(payload) {
        let res = handler.call(store, {
            dispatch: local.dispatch,
            commit: local.commit,
            getters: local.getters,
            state: local.state,
            rootGetters: store.getters,
            rootState: store.state
        }, payload)
        if (!isPromise(res)) {
            res = Promise.resolve(res)
        }
        if (store._devtoolHook) {
            return res.catch(err => {
                store._devtoolHook.emit('vuex:error', err)
                throw err
            })
        } else {
            return res
        }
    })
}

function registerGetter(store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
        return
    }
    store._wrappedGetters[type] = function wrappedGetter(store) {
        return rawGetter(
            local.state, // local state
            local.getters, // local getters
            store.state, // root state
            store.getters // root getters
        )
    }
}
```
