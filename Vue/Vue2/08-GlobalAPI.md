# GlobalAPI

## 入口

在构造函数的上一级，会对Vue调用initGlobalAPI

```JS
initGlobalAPI(Vue) /// 初始化Vue的全局API，封装静态方法
Vue.version = '__VERSION__'
export default Vue
```

## initGlobalAPI

增加Vue上的静态方法和属性
01. Vue.config
02. Vue.util（vue内部的工具方法）
03. Vue.set、Vue.nextTick、Vue.delete
04. Vue.observable
05. Vue.options
06.  keep-alive 处理
07.  initUse设置Vue.use
08.  initMixin设置Vue.mixin
09.  initExtend设置Vue.extend
10. initAssetRegisters处理Vue.options的components、filters和defaults

```JS
export function initGlobalAPI(Vue) {
    // Vue.config
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
    // 6. keep-alive 处理
    extend(Vue.options.components, builtInComponents)
    // 7. initUse设置Vue.use
    initUse(Vue)
    // 8. initMixin设置Vue.mixin
    initMixin(Vue)
    // 9. initExtend设置Vue.extend
    initExtend(Vue)
    // 10. initAssetRegisters处理Vue.options的components、filters和defaults
    initAssetRegisters(Vue)
}
```

## Vue.config

设置Vue默认的基础配置

```JS
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

 存在warn、extend、mergeOptions和defineReactive

 vue.warn为Vue的报错log提示，生产模式下不可用，此处不详细说明

 Vue.defineReactive，就是响应式处理的对应方法，详细见03-响应式处理笔记

 ### Vue.util.extend
  
源码中只是简单的对象的浅层拷贝，即方便后续使用的工具方法

```JS
export function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to
}
```

 ### Vue.util.mergeOptions

01. 孩子的属性获取和标准化为Object-based形式
02. parent与child.extends和child.mixins的配置合并处理
03. 配置合并处理（策略模式，并且优先parent，只会添加child中parent不存在的）
 

```JS
 export function mergeOptions(
     parent,
     child,
     vm
 ) {
     // 1. 孩子的属性获取和标准化为Object-based形式
     if (typeof child === 'function') {
         child = child.options
     }
     normalizeProps(child, vm)
     normalizeInject(child, vm)
     normalizeDirectives(child)
     // 2. parent与child.extends和child.mixins的配置合并处理
     if (!child._base) {
         if (child.extends) {
             parent = mergeOptions(parent, child.extends, vm)
         }
         if (child.mixins) {
             for (let i = 0, l = child.mixins.length; i < l; i++) {
                 parent = mergeOptions(parent, child.mixins[i], vm)
             }
         }
     }
     // 3. 配置合并处理
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

默认策略，优先childVal

```JS
const defaultStrat = function(parentVal, childVal) {
    return childVal === undefined ?
        parentVal :
        childVal
}
```

 ## Vue.set、Vue.delete、Vue.nextTick

 这些就是Vue响应式和异步更新中对应的同名方法，原理不再详说

 ## Vue.observable

 对传入对象使用响应式处理的observe，原理不再详说

 ## Vue.options

### Vue.options属性设置

上面设置了components、filters和defaults，外加_base

_base就是简单的Vue对象

而components、filters和defaults用户自定义的全局属性，先设置号空对象

### components、filters和defaults对应方法注册

initAssetRegisters则是处理对应的方法注册

Vue.component => Vue.options.components
Vue.directive => Vue.options.directives
Vue.filter => Vue.options.filters

```JS
export const ASSET_TYPES = [
    'component',
    'directive',
    'filter'
]
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

##  initUse

设置Vue.use

给Vue扩展功能，希望扩展的时候使用的vue版本一致

插件使用方式

```JS
// 为了给Vue扩展功能，希望扩展的时候使用的vue版本一致
plugin.install = function(Vue, optoins, a, b, c) {}
Vue.use(plugin, options, a, b, c)
```

Vue维护一个_installedPlugins数组，用于管理插件

注册插件则时有以下步骤

01. 获取installedPlugins
02. 检查插件是否安装，安装过直接返回
03. 获取参数（Array.from(arguments).slice(1)，取去除第一项的数组，并将Vue放至第一项）
04. 插件注册
05. 插件添加至installedPlugins数组

```JS
export function initUse(Vue) {
    // Vue.use注册
    Vue.use = function(plugin) {
        // 01. 获取installedPlugins
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        // 02. 检查插件是否安装，安装过直接返回
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }
        // 03. 获取参数
        const args = toArray(arguments, 1)
        args.unshift(this)
        // 04. 插件注册
        if (typeof plugin.install === 'function') { // 调用install方法
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') { // 直接调用方法
            plugin.apply(null, args)
        }
        // 05. 插件添加至installedPlugins数组
        installedPlugins.push(plugin) // 缓存插件
        return this
    }
}
```

## initMixin

设置Vue.mixin

只是简单的对当前Vue调用了mergeOptions

```JS
export function initMixin(Vue) {
    Vue.mixin = function(mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}
```

## initExtend

设置Vue.extend，此处不详细说明，在10-组件实现进行解释
