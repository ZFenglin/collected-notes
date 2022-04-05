# History

作为处理不同环境路由处理的基类，为HASH的H5的模式提供基本方法

提供以下方法
1. 回调注册
2. 跳转接口和确认跳转处理
3. 更新路由处理
4. 注销路由

```JS
export class History {
    // 属性处理
    // ...
    // 构造方法
    constructor(router, base) {
        // 基本的属性声明
        this.router = router
        this.base = normalizeBase(base)
        this.current = START
        this.pending = null
        this.ready = false
        this.readyCbs = []
        this.readyErrorCbs = []
        this.errorCbs = []
        this.listeners = []
    }
    // 回调注册
    listen(cb) {}
    onReady(cb, errorCb) {}
    onError(errorCb) {}
    // 跳转接口
    transitionTo(location, onComplete, onAbort) {}
    // 确认跳转处理
    confirmTransition(route, onComplete, onAbort) {}
    // 更新路由处理
    updateRoute(route) {}
    // 注销路由
    teardown() {}
}
```

## 回调注册

```JS
// 基本回调添加
listen(cb) {
    this.cb = cb
}
// onReady状态的回调添加和触发
onReady(cb, errorCb) {
    if (this.ready) {
        cb()
    } else {
        this.readyCbs.push(cb)
        if (errorCb) {
            this.readyErrorCbs.push(errorCb)
        }
    }
}
// onError回调提添加
onError(errorCb) {
    this.errorCbs.push(errorCb)
}
```

## 跳转接口和确认跳转处理

### transitionTo

1. 路由route获取
2. 记录先前的路由
3. 执行confirmTransition处理路由跳转

```JS
transitionTo(location, onComplete, onAbort) {
    // 路由route获取
    let route
    try {
        route = this.router.match(location, this.current)
    } catch (e) {
        this.errorCbs.forEach(cb => {
            cb(e)
        })
        throw e
    }
    // 记录先前的路由
    const prev = this.current
    // 执行confirmTransition处理路由跳转
    this.confirmTransition(
        route,
        // onComplete回调
        () => {
            // 更新路由
            this.updateRoute(route)
            // 触发onComplete
            onComplete && onComplete(route)
            this.ensureURL()
            // afterHooks钩子触发
            this.router.afterHooks.forEach(hook => {
                hook && hook(route, prev)
            })
            // readyCbs钩子触发
            if (!this.ready) {
                this.ready = true
                this.readyCbs.forEach(cb => {
                    cb(route)
                })
            }
        },
        // onAbort回调
        err => {
            // 触发onAbort
            if (onAbort) {
                onAbort(err)
            }
            // readyErrorCbs钩子触发
            if (err && !this.ready) {
                if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
                    this.ready = true
                    this.readyErrorCbs.forEach(cb => {
                        cb(err)
                    })
                }
            }
        }
    )
}
```

### confirmTransition

真正负责路由跳转是实现的方法

```JS
confirmTransition(route, onComplete, onAbort) {
    // 相关属性设置
    const current = this.current
    this.pending = route
    const abort = err => {
        // errorCbs和onAbort按照条件执行
        // ...
    }
    const lastRouteIndex = route.matched.length - 1
    const lastCurrentIndex = current.matched.length - 1
    // 相同路由返回，防止重复渲染
    if (
        isSameRoute(route, current) &&
        lastRouteIndex === lastCurrentIndex &&
        route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
        // ...
        return abort(createNavigationDuplicatedError(current, route))
    }
    // 路由跳转钩子收集
    // ...
    const queue = [].concat(
        extractLeaveGuards(deactivated),
        this.router.beforeHooks,
        extractUpdateHooks(updated),
        activated.map(m => m.beforeEnter),
        resolveAsyncComponents(activated)
    )
    // iterator遍历器创建
    const iterator = (hook, next) => {
        // 异常abort执行
        // ...
        try {
            // 执行传入的钩子hook
            hook(route, current, (to) => {
                // 异常abort执行
                if (to === false) {
                    // ....
                } else {
                    // 否则执行next
                    next(to)
                }
            })
        } catch (e) {
            abort(e)
        }
    }
    // 遍历队列执行
    runQueue(queue, iterator, () => {
        // 进入守卫回调enterGuards获取
        // ...
        const queue = enterGuards.concat(this.router.resolveHooks)
        // 执行runQueue
        runQueue(queue, iterator, () => {
            // ...
            // 执行onComplete，其中updateRoute用于更新路由
            onComplete(route)
            // 处理app路由进入执行
            // ...
        })
    })
}
```

#### runQueue

VueRoute使用的工具函数，将queue的不断取出并放在iterator中执行

```JS
export function runQueue(queue, fn, cb) {
    const step = index => {
        if (index >= queue.length) {
            cb()
        } else {
            if (queue[index]) {
                fn(queue[index], () => {
                    step(index + 1)
                })
            } else {
                step(index + 1)
            }
        }
    }
    step(0)
}
```

## 路由更新处理

```JS
updateRoute(route: Route) {
    this.current = route
    this.cb && this.cb(route)
}
```

## 路由注销处理

```JS
teardown() {
    this.listeners.forEach(cleanupListener => {
        cleanupListener()
    })
    this.listeners = []
    this.current = START
    this.pending = null
}
```
