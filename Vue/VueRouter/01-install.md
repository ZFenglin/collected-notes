# install

install方法就是用于在当前的Vue的实例上增加路由插件的处理方法

## install添加

router的index文件上声明了VueRouter类，并为其增加install等相关的静态属性

```js
// vue-router/src/index.js
export default class VueRouter {
    // ...
}
// 包括install等静态属性设置
VueRouter.install = install
VueRouter.version = '__VERSION__'
// ...
if (inBrowser && window.Vue) {
    window.Vue.use(VueRouter)
}
```

## install处理

install的作用就是让Vue.use触发，并在Vue上安装Router

1. 已安装拦截
2. 设置相关属性，如installed和_Vue
3. 相关方法声明isDef（判断是否定义）和registerInstance（注册实例）
4. Vue.mixin为组件在beforeCreate时注册相关属性和destroyed销毁实例
5. `$router`和`$route`定义
6. RouterView和RouterLink组件注册，原理见[Vue/VueRouter/Component处理](./07-Component处理.md)
7. 路由钩子合并策略设置（等价于created的合并策略，即借用生命周期的合并策略）

```js
// vue-router/src/install.js
export function install(Vue) {
    // 已安装拦截
    if (install.installed && _Vue === Vue) return
    // 设置相关属性installed和_Vue
    install.installed = true
    _Vue = Vue
    // 相关方法声明isDef和registerInstance
    const isDef = v => v !== undefined // 判断是否定义
    const registerInstance = (vm, callVal) => { // 注册实例
        let i = vm.$options._parentVnode
        if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
            i(vm, callVal)
        }
    }
    // Vue.mixin为组件在beforeCreate时注册相关属性和destroyed销毁实例
    Vue.mixin({
        beforeCreate() {
            if (isDef(this.$options.router)) { // 存在$options.router的vue实例就是根实例，并设置_routerRoot和_router
                this._routerRoot = this
                this._router = this.$options.router
                this._router.init(this)
                Vue.util.defineReactive(this, '_route', this._router.history.current)
            } else { // 非根实例则是从$parent获取设置_routerRoot
                this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
            }
            registerInstance(this, this)
        },
        destroyed() {
            registerInstance(this)
        }
    })
    // $router和$route定义
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router
        }
    })
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route
        }
    })
    // RouterView和RouterLink组件注册
    Vue.component('RouterView', View)
    Vue.component('RouterLink', Link)
    // 路由钩子合并策略设置（等价于created的合并策略，即借用生命周期的合并策略）
    const strats = Vue.config.optionMergeStrategies
    strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```
