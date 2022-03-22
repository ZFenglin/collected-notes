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
06. Vue.options的components、filters和defaults（用户自定义的全局属性）的空对象创建
07. Vue.options._base（Vue创建函数实例）
08. keep-alive 处理
09. initUse设置Vue.use
10. initMixin设置Vue.mixin
11. initExtend设置Vue.extend
12. initAssetRegisters处理Vue.options的components、filters和defaults

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
        mergeOptions,
        defineReactive
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
    // 6. Vue.options的components、filters和defaults（用户自定义的全局属性）的空对象创建
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null)
    })
    // 7. Vue.options._base（Vue创建函数实例）
    Vue.options._base = Vue
    // 8. keep-alive 处理
    extend(Vue.options.components, builtInComponents)
    // 9. initUse设置Vue.use
    initUse(Vue)
    // 10. initMixin设置Vue.mixin
    initMixin(Vue)
    // 11. initExtend设置Vue.extend
    initExtend(Vue)
    // 12. initAssetRegisters处理Vue.options的components、filters和defaults
    initAssetRegisters(Vue)
}
```
