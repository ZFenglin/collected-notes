# store
1. constructor构建基本的store实例
2. state设置获取方法
3. commit提交处理
4. action提交处理
5. 监听处理
6. 模块化处理（说模块化的时候在详细解释）
7. 其他处理

```JS
export class Store {
    // constructor构建基本的store实例
    constructor(options = {}) {}
    // state设置获取方法
    get state() {}
    set state(v) {}
    // commit提交处理
    commit(_type, _payload, _options) {}
    // action提交处理
    dispatch(_type, _payload) {}
    // 监听处理
    subscribe(fn, options) {}
    subscribeAction(fn, options) {}
    watch(getter, cb, options) {}
    // 替换状态
    replaceState(state) {}
    // 模块化处理（说模块化的时候在详细解释）
    registerModule(path, rawModule, options = {}) {}
    unregisterModule(path) {}
    hasModule(path) {}
    // 热更新处理
    hotUpdate(newOptions) {}
    // 严格模式防止警报处理
    _withCommit(fn) {}
}
```

## constructor

```JS
constructor(options = {}) {
    // Vuex安装处理
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
        install(window.Vue)
    }
    // store对应属性声明
    const {
        plugins = [],
            strict = false
    } = options
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()
    this._makeLocalGettersCache = Object.create(null)
    // 绑定dispatch和commit的this指向为当前实例
    const store = this
    const {
        dispatch,
        commit
    } = this
    this.dispatch = function boundDispatch(type, payload) {
        return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit(type, payload, options) {
        return commit.call(store, type, payload, options)
    }
    // 严格模式
    this.strict = strict
    const state = this._modules.root.state
    // 初始化根模块
    installModule(this, state, [], this._modules.root)
    // 初始化store的vm实例
    resetStoreVM(this, state)
    // 应用插件
    plugins.forEach(plugin => plugin(this))
    // devtool处理
    // ...
}
```

## state设置获取方法

```JS
get state() {
    return this._vm._data.$$state
}

set state(v) {
    // 开发模式则有错误提示
    if (__DEV__) {
        assert(false, `use store.replaceState() to explicit replace store state.`)
    }
}
```

## commit

1. 参数处理
2. 获取entry处理数组
3. _withCommit包裹处理entry
4. 订阅触发

```JS
commit(_type, _payload, _options) {
    // 参数处理
    const {
        type,
        payload,
        options
    } = unifyObjectStyle(_type, _payload, _options)
    const mutation = {
        type,
        payload
    }
    // 获取entry处理数组
    const entry = this._mutations[type]
    // 异常警告处理
    // ...
    // _withCommit包裹处理entry 
    this._withCommit(() => {
        entry.forEach(function commitIterator(handler) {
            handler(payload)
        })
    })
    // 订阅触发
    this._subscribers
        .slice()
        .forEach(sub => sub(mutation, this.state))
    // 异常警告处理
    // ...
}
```

## dispatch

1. 参数处理
2.  获取entry
3.  actionSubscribers的before钩子触发
4.  entry按其长度使用Promise.all封装还是直接执行获取result
5.  返回promise封装result的执行
   1. 执行result，并用then处理后续
   2. 成功，actionSubscribers的after钩子触发，resolve(res)
   3. 失败，actionSubscribers的error钩子触发，reject(error)

```JS
dispatch(_type, _payload) {
    // 参数处理
    const {
        type,
        payload
    } = unifyObjectStyle(_type, _payload)
    const action = {
        type,
        payload
    }
    // 获取entry
    const entry = this._actions[type]
    // 异常警告处理
    // ...
    try {
        // actionSubscribers的before钩子触发
        this._actionSubscribers
            .slice()
            .filter(sub => sub.before)
            .forEach(sub => sub.before(action, this.state))
    } catch (e) {
        // 异常警告处理
        // ...
    }
    // entry按其长度使用Promise.all封装还是直接执行result
    const result = entry.length > 1 ?
        Promise.all(entry.map(handler => handler(payload))) :
        entry[0](payload)
    // 返回promise封装result的执行
    return new Promise((resolve, reject) => {
        result.then(res => {
            try {
                // actionSubscribers的after钩子触发
                this._actionSubscribers
                    .filter(sub => sub.after)
                    .forEach(sub => sub.after(action, this.state))
            } catch (e) {
                // 异常警告处理
                // ...
            }
            resolve(res)
        }, error => {
            try {
                // actionSubscribers的error钩子触发
                this._actionSubscribers
                    .filter(sub => sub.error)
                    .forEach(sub => sub.error(action, this.state, error))
            } catch (e) {
                // 异常警告处理
                // ...
            }
            reject(error)
        })
    })
}
```

## 监听处理

```JS
// 监听订阅处理
subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options)
}
// action监听订阅处理
subscribeAction(fn, options) {
    const subs = typeof fn === 'function' ? {
        before: fn
    } : fn
    return genericSubscribe(subs, this._actionSubscribers, options)
}
// this._watcherVM的watch处理this.state, this.getters变动监听
watch(getter, cb, options) {
    // ...
    return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
}
```

## 其他处理

```JS
// 替换状态
replaceState(state) {
    this._withCommit(() => {
        this._vm._data.$$state = state
    })
}
// ...
// 热更新
hotUpdate(newOptions) {
    this._modules.update(newOptions)
    resetStore(this, true)
}
// 严格模式方法执行
_withCommit(fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
}
```
