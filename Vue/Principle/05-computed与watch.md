# computed与watch

1. watch是userWatcher，绑定数据变更，触发传入的cb
2. computed是lazyWatcher，只有对应的值变得，才会触发新值

## watch

### Watcher中watch相关处理

1. constructor处理
    1. $watch的watcher的options.user为true
    2. this.cb = cb
    3. this.getter赋值，判断expOrFn是否时function，对于`'obj.a'`，会进行处理成获取值的函数
2. run中执行get，获取新旧值，执行cb回调

### initWatch(vm, watch)

1. 遍历watch，获取每一项handler
    1. handler为数组，遍历handler，执行createWatcher(vm, key, handler[i])
    2. 否则直接执行createWatcher(vm, key, handler)

### 创建userWatcher

#### createWatcher( vm, expOrFn, handler, options)

1. handler为纯粹对象，为了获取真实处理的cb
    1. options = handler
    2. handler = handler.handler
2. handler为字符串
    1. handler = vm[handler]
3. 返回vm.$watch(expOrFn, handler, options)

#### Vue.prototype.$watch(expOrFn, cb, options)

1. cb为纯粹对象，直接返回createWatcher(vm, expOrFn, cb, options)
2. options设置，并定义options.user为true
3. const watcher = new Watcher(vm, expOrFn, cb, options)
4. options.immediate为true，则直接执行一次
    1. pushTarget()
    2. 执行cb
    3. popTarget()
5. 返回清除watcher监听方法，方法内部执行watcher.teardown

## computed

计算属性的值会记录LazyWatcher和RenderWatcher

### Watcher中computed相关处理

1. constructor处理
    1. computed的watcher的options.lazy为true
    2. 设定dirty，用于标识判断computed是否要更新
    3. 结尾不会执行get，computed不会在初始化执行
2. evaluate执行get更新computed值，createComputedGetter中判断执行
3. update中对于lazyWatcher，只是将dirty设置为true

### initComputed(vm, computed)

1. const watchers = vm._computedWatchers = Object.create(null)，用于收集相关的所有watchers
2. 遍历computed
    1. 获取userDef并判断获取getter
    2. watchers[key] = new Watcher(vm, getter || noop, noop, { lazy: true }) // noop为无操作
    3. vm不存在key，则defineComputed(vm, key, userDef)定义到vm上

### 定义computed至vm（服务端渲染部分不解析）

#### defineComputed(target, key, userDef)

1. 当不是服务端渲染，则shouldCache为true
2. typeof userDef === 'function'
    1. userDef为true
        1. sharedPropertyDefinition.get = createComputedGetter(key)
        2. sharedPropertyDefinition.set = noop
    2. userDef为false
        1. sharedPropertyDefinition.get = createComputedGetter(key)
        2. sharedPropertyDefinition.set = userDef.set || noop
3. Object.defineProperty(target, key, sharedPropertyDefinition)

#### createComputedGetter(key)

1. 返回function computedGetter()
    1. 从_computedWatchers获取当前key对应的watcher：this._computedWatchers[key]
    2. 脏数据执行evaluate更新数据：watcher.dirty && watcher.evaluate()
    3. Dep.target存在则执行depend收集：Dep.target && watcher.depend()
        1. Dep.target为当前实例的RenderWatcher
        2. depend则遍历LazyWatcher内部的deps，即内部属性的dep收集Dep.target
    4. 返回watcher.value

## 相关问题

### 三种Watcher创建方式

#### RenderWatcher

1. $mount创建的watcher
2. updateComponent为触发_update(_render())的函数
3. noop则表示没有cb，不会再run时触发

```js
new Watcher(vm, updateComponent, noop, {
    before() {
        if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
        }
    }
}, true /* isRenderWatcher */ )
```

#### UserWatcher

1. $watch创建的watcher
2. expOrFn为设置的watch的key，watch内部就会获取vm上对应的值
3. cb为watch的handle函数
4. options中增加user: true，也可以设置deep，immediate相关配置

```js
new Watcher(vm, expOrFn, cb, options)
```

#### LazyWatcher

1. computed创建的watcher
2. getter为computed中设置的get
3. computedWatcherOptions为设置了lazy: true的对象，此时Watcher的constructor中不会执行get

```js
watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions)
```

### Computed收集方式

1. 执行渲染，Dep.target维护的stack此时只有RenderWatcher
2. 获取computed的值执行get
    1. evaluate获取computed的值执行get处理
        1. 将其LazyWatcher入栈，并设为Dep.target
        2. getter执行，computed内部的响应式属性的dep收集Dep.target
        3. LazyWatcher出栈
    2. Dep.target此时为RenderWatcher，调用depend，computed内部的响应式属性的dep收集Dep.target
3. 即comuted内部的属性的dep会收集computed的LazyWatcher，也会收集当前实例的RenderWatchers
4. 所以当前内部属性更新，会通知LazyWatcher执行update，也会通知RenderWatcher执行更新
