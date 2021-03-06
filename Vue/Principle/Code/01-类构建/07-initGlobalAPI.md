# initGlobalAPI

增加Vue上的静态方法和属性

```js
export function initGlobalAPI(Vue) {
    // 1. Vue.config
    const configDef = {}
    configDef.get = () => config
    Object.defineProperty(Vue, 'config', configDef)
    // 2. Vue.util（vue内部的工具方法）
    Vue.util = {
        warn,
        extend,
        mergeOptions, // 配置合并
        defineReactive // 响应式数据
    }
    // 3. Vue.set、Vue.nextTick、Vue.delete
    Vue.set = set
    Vue.delete = del
    Vue.nextTick = nextTick
    // 4. Vue.observable（监控对象）
    Vue.observable = (obj) => {
        observe(obj)
        return obj
    }
    // 5. Vue.options
    Vue.options = Object.create(null)
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null)
    })
    Vue.options._base = Vue
    // ...
    // 6. initUse设置Vue.use
    initUse(Vue)
    // 7. initMixin设置Vue.mixin
    initMixin(Vue)
    // 8. initExtend设置Vue.extend
    initExtend(Vue)
    // 9. initAssetRegisters处理Vue.options的components、filters和directive
    initAssetRegisters(Vue)
}
```

## Vue.config

1. Vue默认的基础配置，用于控制vue默认的处理方式

```js
export default ({
    // 选项合并 (used in core/util/options)
    optionMergeStrategies: Object.create(null),
    // 是否抑制警告
    silent: false,
    // 是否显示提示消息
    productionTip: process.env.NODE_ENV !== 'production',
    // 是否支持开发工具
    devtools: process.env.NODE_ENV !== 'production',
    // 是否记录性能
    performance: false,
    // watcher错误处理
    errorHandler: null,
    // watcher警告处理
    warnHandler: null,
    // 忽略自定义元素
    ignoredElements: [],
    // v-on 的自定义用户密钥别名
    keyCodes: Object.create(null),
    // 检查标签是否保留
    isReservedTag: no,
    // 检查属性是否保留
    isReservedAttr: no,
    // 检查是否为未知元素
    isUnknownElement: no,
    // 获取元素命名空间
    getTagNamespace: noop,
    // 解析特定平台真实标签名称
    parsePlatformTagName: identity,
    // 检查是否必须使用属性绑定属性
    mustUseProp: no,
    // 是否执行异步更新
    async: true,
    _lifecycleHooks: LIFECYCLE_HOOKS
}: Config)
```

## Vue.util

1. 存在warn、extend、mergeOptions和defineReactive
2. vue.warn为Vue的报错log提示，生产模式下不可用，此处不详细说明
3. Vue.defineReactive，就是响应式处理的对应方法，详见[Vue/响应式原理/响应式处理](../02-响应式原理/01-响应式处理.md)

### Vue.util.extend

1. 源码中只是简单的对象的浅层拷贝
2. 即方便后续使用的工具方法

```js
export function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to
}
```

### Vue.util.mergeOptions

1. 孩子的属性获取和标准化为Object-based形式
2. parent与child.extends和child.mixins的配置合并处理
3. 配置合并处理（策略模式，并且优先parent，只会添加child中parent不存在的）

```js
 export function mergeOptions(parent, child, vm) {
     // 孩子的属性获取和标准化为Object-based形式
     if (typeof child === 'function') {
         child = child.options
     }
     normalizeProps(child, vm)
     normalizeInject(child, vm)
     normalizeDirectives(child)
     // parent与child.extends和child.mixins的配置合并处理
     if (!child._base) {
         if (child.extends) {
             parent = mergeOptions(parent, child.extends, vm)
         }
         if (child.mixins) {
             for (let i = , l = child.mixins.length; i < l; i++) {
                 parent = mergeOptions(parent, child.mixins[i], vm)
             }
         }
     }
     // 配置合并处理
     const options = {}
     let key
     for (key in parent) {
         mergeField(key)
     }
     for (key in child) {
         if (!hasOwn(parent, key)) {
             mergeField(key)
         }
     }

     function mergeField(key) {
         // 利用策略模式，如果存在对应策略的方式，则按策略执行，否则默认合并
         const strat = strats[key] || defaultStrat
         options[key] = strat(parent[key], child[key], vm, key)
     }
     return options
 }
```

#### 默认策略，优先childVal

```js
const defaultStrat = function(parentVal, childVal) {
    return childVal === undefined ?
        parentVal :
        childVal
}
```

## Vue.options

### Vue.options属性设置

1. 创建_base和赋值了简单的Vue对象
2. 创建components、filters和directive用户自定义的全局属性

### components、filters和directive对应方法注册

initAssetRegisters则是处理对应的方法注册

1. Vue.component => Vue.options.components
2. Vue.directive => Vue.options.directives
3. Vue.filter => Vue.options.filters

```js
export const ASSET_TYPES = ['component', 'directive', 'filter']
export function initAssetRegisters(Vue) {
    ASSET_TYPES.forEach(type => {
        Vue[type] = function(id, definition) {
            if (!definition) {
                return this.options[type + 's'][id]
            } else {
                if (type === 'component' && isPlainObject(definition)) {
                    definition.name = definition.name || id
                    // 调用Vue.extend注册对应组件的构造函数
                    definition = this.options._base.extend(definition)
                }
                if (type === 'directive' && typeof definition === 'function') {
                    // Vue全局指令注册
                    definition = {
                        bind: definition,
                        update: definition
                    }
                }
                this.options[type + 's'][id] = definition
                return definition
            }
        }
    })
}
```

## initUse

设置Vue.use

1. 用于给Vue扩展功能，希望扩展的时候使用的vue版本一致
2. Vue维护一个_installedPlugins数组，用于管理插件

```js
// 为了给Vue扩展功能，希望扩展的时候使用的vue版本一致
plugin.install = function(Vue, optoins, a, b, c) {}
Vue.use(plugin, options, a, b, c)
```

### 注册插件则时有以下步骤

1. 获取installedPlugins
2. 检查插件是否安装，安装过直接返回
3. 获取参数（Array.from(arguments).slice(1)，取去除第一项的数组，并将Vue放至第一项）
4. 插件注册
5. 插件添加至installedPlugins数组

```js
export function initUse(Vue) {
    // Vue.use注册
    Vue.use = function(plugin) {
        // 获取installedPlugins
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        // 检查插件是否安装，安装过直接返回
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }
        // 获取参数
        const args = toArray(arguments, 1)
        args.unshift(this)
        // 插件注册
        if (typeof plugin.install === 'function') { // 调用install方法
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') { // 直接调用方法
            plugin.apply(null, args)
        }
        // 插件添加至installedPlugins数组
        installedPlugins.push(plugin) // 缓存插件
        return this
    }
}
```

## initMixin

```js
// 对当前Vue调用了mergeOptions
export function initMixin(Vue) {
    Vue.mixin = function(mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}
```

## 其它

1. Vue.set、Vue.delete、Vue.nextTick和Vue.observable，这些就是Vue响应式和异步更新中对应的同名方法
2. initExtend，设置Vue.extend，用于组件配置部分，详情见[Vue/组件化/组件配置](../04-组件化/01-组件配置.md)
