# install

Vuex在目录index中导出所有相关方法

```JS
export default {
    Store,
    install,
    version: '__VERSION__',
    mapState,
    mapMutations,
    mapGetters,
    mapActions,
    createNamespacedHelpers,
    createLogger
}

export {
    Store,
    install,
    mapState,
    mapMutations,
    mapGetters,
    mapActions,
    createNamespacedHelpers,
    createLogger
}
```

## Store的install执行

Store的constructor执行install

```JS
// vuex/src/store.js 
export class Store {
    constructor(options = {}) {
        if (!Vue && typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }
        // ...
    }
}

export function install(_Vue) {
    if (Vue && _Vue === Vue) {
        // 相同实例拦截，防止重复创建
        return
    }
    Vue = _Vue
    applyMixin(Vue)
}
```

## applyMixin

负责在每个实例的beforeCreate时挂载vuex

```JS
// vuex/src/mixin.js
export default function(Vue) {
    const version = Number(Vue.version.split('.')[0])

    if (version >= 2) {
        // vue2以上的使用mixin
        Vue.mixin({
            beforeCreate: vuexInit
        })
    } else {
        // Vue1.0版本的触发install方式
        const _init = Vue.prototype._init
        Vue.prototype._init = function(options = {}) {
            options.init = options.init ? [vuexInit].concat(options.init) :
                vuexInit
            _init.call(this, options)
        }
    }

    // 获取根组件的store，将它共享给每个组件
    function vuexInit() {
        // 每个组件中都应该有$store
        const options = this.$options
        if (options.store) { // 存在这个store属性就是根
            this.$store = typeof options.store === 'function' ?
                options.store() :
                options.store
        } else if (options.parent && options.parent.$store) {
            // 先保证为子组件，并且父亲有$store
            this.$store = options.parent.$store
        }
    }
}
```

## 4.0版本的install

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
