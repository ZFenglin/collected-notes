# HTML5History

## 相关处理方法

```JS
// 获取当前路径
export function getLocation(base) {
    let path = window.location.pathname
    const pathLowerCase = path.toLowerCase()
    const baseLowerCase = base.toLowerCase()
    if (base && ((pathLowerCase === baseLowerCase) ||
            (pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0))) {
        path = path.slice(base.length)
    }
    return (path || '/') + window.location.search + window.location.hash
}
```

## HTML5History

处理h5下的路由跳转

```JS
export class HTML5History extends History {
    // ...
    constructor(router, base) {
        super(router, base)
        this._startLocation = getLocation(this.base)
    }
    // setupListeners注册变动监听
    setupListeners() {}
    // 路由跳转h5模式下实现
    go(n) {}
    push(location, onComplete, onAbort) {}
    replace(location, onComplete, onAbort) {}
    // 其它方法实现
    ensureURL(push) {}
    getCurrentLocation() {}
}
```

### setupListeners注册变动监听

```JS
  setupListeners() {
      if (this.listeners.length > 0) {
          return
      }
      //...
      const handleRoutingEvent = () => {
          const current = this.current
          const location = getLocation(this.base)
          if (this.current === START && location === this._startLocation) {
              return
          }
          // 执行transitionTo切换组件并渲染
          this.transitionTo(location, route => {
              // scroll滚动处理
              // ...
          })
      }
      // H5利用popstate进行监听处理
      window.addEventListener('popstate', handleRoutingEvent)
      // 添加listeners
      this.listeners.push(() => {
          window.removeEventListener('popstate', handleRoutingEvent)
      })
  }
```

### 路由跳转h5模式下实现

```JS
go(n) {
    window.history.go(n)
}

push(location, onComplete, onAbort) {
    const {
        current: fromRoute
    } = this
    this.transitionTo(location, route => {
        pushState(cleanPath(this.base + route.fullPath))
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
    }, onAbort)
}

replace(location, onComplete, onAbort) {
    const {
        current: fromRoute
    } = this
    this.transitionTo(location, route => {
        replaceState(cleanPath(this.base + route.fullPath))
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
    }, onAbort)
}
```

### 其它方法实现

```JS
// 确保路径正确
ensureURL(push) {
    if (getLocation(this.base) !== this.current.fullPath) {
        const current = cleanPath(this.base + this.current.fullPath)
        push ? pushState(current) : replaceState(current)
    }
}
// 获取当前路径
getCurrentLocation() {
    return getLocation(this.base)
}
```
