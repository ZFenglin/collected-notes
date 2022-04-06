# install

Vuex在目录index中导出所有相关方法

```JS
export default {
    version: '__VERSION__',
    Store,
    storeKey,
    createStore,
    useStore,
    mapState,
    mapMutations,
    mapGetters,
    mapActions,
    createNamespacedHelpers,
    createLogger
}

export {
    Store,
    storeKey,
    createStore,
    useStore,
    mapState,
    mapMutations,
    mapGetters,
    mapActions,
    createNamespacedHelpers,
    createLogger
}
```

利用createStore创建store实例

```JS
export function createStore(options) {
    return new Store(options)
}
```

在store的实例中使用install向app上注册对应的属性

```JS
export class Store {
    // ...
    install(app, injectKey) {
        //  provide增加当前store
        app.provide(injectKey || storeKey, this)
        // globalProperties.$store设置
        app.config.globalProperties.$store = this
        // 开发者工具处理
    }
    // ...
}
```
