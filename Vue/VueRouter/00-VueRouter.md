# VueRouter

1. 核心就是按照路径变化，找到对应组件，并显式再router-view中

## install(Vue)

1. installed和_Vue属性设置
    1. installed用于后续判断是否，防止重复注册
    2. _Vue用于VueRouter内部使用
2. 利用Vue.mixin为每个组件设置实例注册和实例销毁
    1. beforeCreate中判断this.$options.router
        1. 存在为根组件
            1. this._routerRoot = this
            2. this._router = this.$options.router
            3. 初始化实例：this._router.init(this)
            4. Vue.util.defineReactive响应式定义this._router.history.current到vm的_route
        2. 不存在，则从$parent上获取_routerRoot并设置为自身_routerRoot
    2. destroyed
3. Object.defineProperty定义路由属性的get到Vue.prototype上
    1. $router：this._routerRoot._router // 方法
    2. $route：this._routerRoot._route // Route的对象，存放属性
4. RouterView与RouterLink组件注册
5. 借用Vue的mergeHook的策略设置为自身钩子处理策略

## class VueRouter

### constructor(options)

1. 钩子收集
    1. this.beforeHooks = []
    2. this.resolveHooks = []
    3. this.afterHooks = []
2. 调用createMatcher创建匹配器matcher，返回操作接口
3. 模式mode设置，默认hash
4. 按照模式创建对应的history实例
    1. HTML5History
    2. HashHistory
    3. AbstractHistory

### init(app)

1. 获取当前history
2. setupListeners创建，用于注册路由变化监听：setupListeners = () => {history.setupListeners()}
3. 页面初始化后后，需要先进行一次跳转：history.transitionTo(history.getCurrentLocation(),setupListeners)
4. 回调设置current变化时更新_route
    1. history.listen(route => { this.apps.forEach(app => { app._route = route})})
    2. _route更新由于是响应式的属性，所以页面会更新

### match(raw, current, redirectedFrom)

1. 返回this.matcher.match(raw, current, redirectedFrom)

### push(location, onComplete, onAbort)

1. !onComplete && !onAbort时，则用Promise封装返回
2. 否则直接执行this.history.push(location, onComplete, onAbort)

## 匹配器处理

1. createMatcher调用createRouteMap获取映射，返回处理映射方法
2. createRouteMap设置映射，调用addRouteRecord为映射增加record
3. addRouteRecord处理route并迭代处理其children，创建record并设置到映射中

### createMatcher(routes, router)

1. 执行createRouteMap创建路径和记录匹配的映射表
    1. pathList
    2. pathMap
    3. nameMap
2. 返回方法设置
    1. match
        1. 通过name或path查找对应的recoder
        2. 利用获取的属性调用_createRoute创建对应Route
    2. addRoute
        1. 执行createRouteMap增加新路由记录
    3. getRoutes
    4. addRoutes

### createRouteMap(routes, oldPathMap, parent ...)

1. 存储对象设置，有传入对应值则设置为初始值
    1. pathList：路由路径收集数组
    2. pathMap：path和record映射收集对象
    3. nameMap：name和record映射收集对象
2. 遍历routes，执行addRouteRecord创建记录
3. 返回pathList、pathMap和nameMap

### addRouteRecord(route, pathMap, parent, ...)

1. 路径处理normalizePath(route.path, parent, ...)，将父路径拼接到子路径前
2. 创建record对象
    1. path
    2. components
    3. props
    4. ...
3. 遍历route.children，迭代处理addRouteRecord(child, pathMap, record)
4. 将record设置到pathList、pathMap和nameMap中

## History设置

1. 存在一个History，作为所有类型的基础
2. HashHistory：location.hash => push
3. HTML5History: pushState => push

### History

1. constructor设置路由属性
    1. this.router
    2. this.current = START
        1. START就是createRoute(null, {path: '/'})执行结果
        2. createRoute就是利用传入值，创建一个Route的对象，包含matched等属性
    3. ...
2. transitionTo(location, onComplete, ...)
    1. 获取current：const current = this.current
    2. 通过传入的location，获取记录：route = this.router.match(location, this.current)
    3. 比较route和current是否变化，未变化直接返回
    4. 处理Hooks
        1. 路由跳转queue获取
        2. 创建iterator(hook, next)
            1. 执行每个钩子
            2. 处理完执行next
        3. runQueue传入queue、iterator和回调
            1. 设置index=0
            2. 设置step
                1. 当index超出queue.length回调处理
                    1. 执行updateRoute(route)
                        2. 更新this.current：this.current = route
                        3. 执行this.cb(current)更新_route：this.cb && this.cb(route)
                    2. onComplete存在则执行
                2. 每次都执行fn(queue[index], () => {step(index + 1)})
            3. 执行step(0)

3. listen(cb)
    1. 简单设置回调：listen(cb) { this.cb = cb }

### HashHistory extends History

1. constructor
    1. 处理父类super(router, base)
    2. ensureSlash()，用于确保路由存在 #
2. getCurrentLocation
    1. getHash获取hash路径
3. setupListeners
    1. window.addEventListener(eventType, handleRoutingEvent)
        1. eventType= supportsPushState ? 'popstate' :'hashchange'
        2. handleRoutingEvent则是当hash值变化，再执行this.transitionTo(getHash(), ...)
4. push(location, onComplete, onAbort)
    1. 执行this.transitionTo进行跳转处理

### HTML5History extends History

1. HTML5History和HashHistory一样，也需要处理对应的方法
2. getCurrentLocation返回getLocation(this.base)
3. setupListeners注册popstate监听，变动执行this.transitionTo
4. push处理也是执行this.transitionTo

## Component处理

### RouterLink

1. props传入对应属性
2. 根据属性处理对应跳转事件
3. render返回一个设置相关属性和跳转事件的a标签

### RouterView

1. 设置当前标签为routerView为true：data.routerView = true
2. depth设置
    1. 不断向上访问找到当前的RouterView的层级depth
    2. 设置属性：data.routerViewDepth = depth
3. 通过过depth找matched中对应route获取component
    1. matched = route.matched[depth]
    2. component = matched && matched.components[name]
4. component不存在渲染空组件
5. 缓存组件：cache[name] = {component}
6. 返回处理好的组件：h(component, data, children)
