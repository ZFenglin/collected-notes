# HashHistory

## 相关处理方法

```JS
// 处理当前的window.location.hre的路径，确保其是hash路径
function ensureSlash() {
    const path = getHash()
    if (path.charAt(0) === '/') {
        return true
    }
    replaceHash('/' + path)
    return false
}
// 获取hash路径
export function getHash() {
    let href = window.location.href
    const index = href.indexOf('#')
    if (index < 0) return ''
    href = href.slice(index + 1)
    return href
}
// 获取url路径
function getUrl(path) {
    const href = window.location.href
    const i = href.indexOf('#')
    const base = i >= 0 ? href.slice(0, i) : href
    return `${base}#${path}`
}
// 设置hash
function pushHash(path) {
    if (supportsPushState) {
        pushState(getUrl(path))
    } else {
        window.location.hash = path
    }
}
// 替换hash
function replaceHash(path) {
    if (supportsPushState) {
        replaceState(getUrl(path))
    } else {
        window.location.replace(getUrl(path))
    }
}
```

## HashHistory

专门处理Hash模式下的路由方法执行

1. setupListeners注册变动监听
2. 路由跳转hash模式下实现
3. 其它方法实现

```JS
export class HashHistory extends History {
    constructor(router, base, fallback) {
        // 执行base基类实现
        super(router, base)
        // ...
        ensureSlash()
    }
    // setupListeners注册变动监听
    setupListeners() {}
    // 路由跳转hash模式下实现
    push(location, onComplete, onAbort) {}
    replace(location, onComplete, onAbort) {}
    go(n) {}
    // 其它方法实现
    ensureURL(push) {}
    getCurrentLocation() {}
}
```

### setupListeners注册变动监听

向浏览器注册hash变动监听，变动后执行transitionTo切换组件并渲染

```JS
setupListeners() {
    // 已注册返回
    if (this.listeners.length > 0) {
        return
    }
    // ...
    const handleRoutingEvent = () => {
        const current = this.current
        if (!ensureSlash()) {
            return
        }
        // 执行transitionTo切换组件并渲染
        this.transitionTo(getHash(), route => {
            if (supportsScroll) {
                handleScroll(this.router, route, current, true)
            }
            if (!supportsPushState) {
                replaceHash(route.fullPath)
            }
        })
    }
    // 按照是否支持popstate，决定监听方式
    const eventType = supportsPushState ? 'popstate' : 'hashchange'
    // 注册监听
    window.addEventListener(
        eventType,
        handleRoutingEvent
    )
    // 添加listeners
    this.listeners.push(() => {
        window.removeEventListener(eventType, handleRoutingEvent)
    })
}
```

### 路由跳转hash模式下实现

```JS
push(location, onComplete, onAbort) {
    const {
        current: fromRoute
    } = this
    this.transitionTo(
        location,
        route => {
            pushHash(route.fullPath)
            handleScroll(this.router, route, fromRoute, false)
            onComplete && onComplete(route)
        },
        onAbort
    )
}

replace(location, onComplete, onAbort) {
    const {
        current: fromRoute
    } = this
    this.transitionTo(
        location,
        route => {
            // push的区别就在与完成调用replaceHash
            replaceHash(route.fullPath)
            handleScroll(this.router, route, fromRoute, false)
            onComplete && onComplete(route)
        },
        onAbort
    )
}

go(n) {
    window.history.go(n)
}
```

### 其它方法实现

```JS
// 确保路径正确
ensureURL(push) {
    const current = this.current.fullPath
    if (getHash() !== current) {
        push ? pushHash(current) : replaceHash(current)
    }
}
// 获取当前路径
getCurrentLocation() {
    return getHash()
}
```