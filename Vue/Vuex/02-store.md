# store

## 整体代码

1. constructor构建基本的store实例
2. state设置获取方法
3. commit提交处理
4. action提交处理
5. 监听处理
6. 模块化处理（说模块化的时候在详细解释）

```js
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
    // 以下的后续会提及当前不说明
    // ...
}
```

## constructor

```js
constructor(options = {}) {
    // Vuex安装处理
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
        install(window.Vue)
    }
    // 属性处理
    // ...
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
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
    // ...
    // 初始化store的vm实例（处理state和getter）
    resetStoreVM(this, state)
    // ...
}
```

## resetStoreVM

resetStoreVM用于重置store处理的vm实例
1. 相关属性声明和computed创建
2. 创建新实例vm接收data和computed
3. 严格模式启动
4. 旧实例销毁

```js
function resetStoreVM(store, state, hot) {
    // 相关属性声明和computed创建
    const oldVm = store._vm
    store.getters = {}
    store._makeLocalGettersCache = Object.create(null)
    const wrappedGetters = store._wrappedGetters
    const computed = {}
    // getter定义到store上
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
    // 严格模式启动（详细见严格模式）
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

## state

```js
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

```js
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
    // _withCommit包裹处理entry（与严格模式有关）
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

```js
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
