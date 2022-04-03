# VueRouter

VueRouter类

```JS
export default class VueRouter {
    // 构造函数处理
    constructor(options) {}
    // 路由匹配
    match(raw, current, redirectedFrom) {}
    // 获取当前路由
    get currentRoute() {}
    // 初始化处理
    init(app) {}
    // 路由钩子注册
    beforeEach(fn) {}
    beforeResolve(fn) {}
    afterEach(fn) {}
    // history钩子注册
    onReady(cb, errorCb) {}
    onError(errorCb) {}
    // 路由跳转处理
    push(location, onComplete, onAbort) {}
    replace(location, onComplete, onAbort) {}
    go(n) {}
    back() {}
    forward() {}
    // 获取匹配路由的组件
    getMatchedComponents(to) {}
    // 
    resolve(to, current, append) {}
    // Route相关处理
    getRoutes() {}
    addRoute(parentOrRoute, route) {}
    addRoutes(routes) {}
}
```

## constructor

1. 基本配置
2. 钩子收集
3. 匹配器matcher创建
4. 模式mode判断
5. 按照模式创建对应的history

```JS
  constructor(options) {
      // 收集vue实例，初始化使用
      this.app = null
      this.apps = []
      // 基本配置
      this.options = options
      // 钩子收集
      this.beforeHooks = []
      this.resolveHooks = []
      this.afterHooks = []
      // 匹配器创建
      this.matcher = createMatcher(options.routes || [], this)
      // 模式判断
      let mode = options.mode || 'hash'
      this.fallback =
          mode === 'history' && !supportsPushState && options.fallback !== false
      if (this.fallback) {
          mode = 'hash'
      }
      if (!inBrowser) {
          mode = 'abstract'
      }
      this.mode = mode
      // 按照模式创建对应的history
      switch (mode) {
          case 'history':
              this.history = new HTML5History(this, options.base)
              break
          case 'hash':
              this.history = new HashHistory(this, options.base, this.fallback)
              break
          case 'abstract':
              this.history = new AbstractHistory(this, options.base)
              break
          default:
              // 报错处理
      }
  }
```

## match

匹配结果返回

```JS
match(raw, current, redirectedFrom) {
    return this.matcher.match(raw, current, redirectedFrom)
}
```

## currentRoute

当前路由获取

```JS
get currentRoute() {
    return this.history && this.history.current
}
```

## init

初始化处理，给vue实例注册对应的钩子

```JS
  init(app) {
      // 当前实例入队
      this.apps.push(app)
      // 实例注册销毁history钩子
      app.$once('hook:destroyed', () => {
          const index = this.apps.indexOf(app)
          if (index > -1) this.apps.splice(index, 1)
          if (this.app === app) this.app = this.apps[0] || null
          if (!this.app) this.history.teardown()
      })
      // 当前已经处理过了，返回
      if (this.app) {
          return
      }
      this.app = app
      const history = this.history
      if (history instanceof HTML5History || history instanceof HashHistory) {
          const handleInitialScroll = routeOrError => {
              const from = history.current
              const expectScroll = this.options.scrollBehavior
              const supportsScroll = supportsPushState && expectScroll
              if (supportsScroll && 'fullPath' in routeOrError) {
                  handleScroll(this, routeOrError, from, false)
              }
          }
          // history首次跳转监听
          const setupListeners = routeOrError => {
              history.setupListeners()
              handleInitialScroll(routeOrError)
          }
          // 页面初始化完成后跳转至当前地址
          history.transitionTo(
              history.getCurrentLocation(),
              setupListeners,
              setupListeners
          )
      }
      // history监听注册
      history.listen(route => {
          this.apps.forEach(app => {
              app._route = route
          })
      })
  }
```

## 路由钩子注册

用于注册对应的路由钩子

```JS
beforeEach(fn) {
    return registerHook(this.beforeHooks, fn)
}
beforeResolve(fn) {
    return registerHook(this.resolveHooks, fn)
}
afterEach(fn) {
    return registerHook(this.afterHooks, fn)
}
```

执行钩子方法

```JS
function registerHook(list, fn) {
    list.push(fn)
    return () => {
        const i = list.indexOf(fn)
        if (i > -1) list.splice(i, 1)
    }
}
```

## history钩子注册

```JS
onReady(cb, errorCb) {
    this.history.onReady(cb, errorCb)
}
onError(errorCb) {
    this.history.onError(errorCb)
}
```

## history路由跳转方法处理

push和replace中onComplete与onAbort不存在的话则会放入Promise中并返回

```JS
push(location, onComplete, onAbort) {
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
            this.history.push(location, resolve, reject)
        })
    } else {
        this.history.push(location, onComplete, onAbort)
    }
}
replace(location, onComplete, onAbort) {
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
            this.history.replace(location, resolve, reject)
        })
    } else {
        this.history.replace(location, onComplete, onAbort)
    }
}
go(n: number) {
    this.history.go(n)
}
back() {
    this.go(-1)
}
forward() {
    this.go(1)
}
```

## getMatchedComponents

获取当前路径匹配的组件

```JS
getMatchedComponents(to) {
    // 获取to对应的route
    const route = to ?
        to.matched ?
        to :
        this.resolve(to).route :
        this.currentRoute
    if (!route) {
        return []
    }
    // 通过route获取对应的组件
    return [].concat.apply(
        [],
        route.matched.map(m => {
            return Object.keys(m.components).map(key => {
                return m.components[key]
            })
        })
    )
}
```

## resolve

```JS
resolve(to, current, append) {
    current = current || this.history.current
    const location = normalizeLocation(to, current, append, this)
    const route = this.match(location, current)
    const fullPath = route.redirectedFrom || route.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
        location,
        route,
        href,
        normalizedTo: location,
        resolved: route
    }
}
```

## Route相关处理

```JS
getRoutes() {
    return this.matcher.getRoutes()
}
addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route)
    if (this.history.current !== START) {
        this.history.transitionTo(this.history.getCurrentLocation())
    }
}
addRoutes(routes) {
    this.matcher.addRoutes(routes)
    if (this.history.current !== START) {
        this.history.transitionTo(this.history.getCurrentLocation())
    }
}
```
