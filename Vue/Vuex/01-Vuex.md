# Vuex

## install(_Vue)

1. 判断Vue与_Vue是否一致，一致则跳过
2. Vue = _Vue
3. applyMixin(Vue)
    1. 按照版本初始化
        1. version>2的，则直接Vue.mixin设置beforeCreate触发vuexInit
        2. 否则直接放在Vue.prototype._init中
    2. vuexInit
        1. const options = this.$options
        2. 判断options.store是否存在，设置this.$store
            1. 存在则值为：typeof options.store === 'function'? options.store() ：options.store
            2. 否则值为：options.parent.$store存在则设置

## class Store

### constructor(options = {})

1. 通过options处理相关属性设置
    1. this._actions
    2. this._mutations
    3. this._wrappedGetters
2. this.dispatch与this.commit设置为绑定方法
    1. return dispatch.call(store, type, payload)
    2. return commit.call(store, type, payload, options)
3. 初始化store的vm实例(stroe的state和getters使用)： resetStoreVM(this, state)

### resetStoreVM(store, state, hot)

1. 属性设置
    1. store.getters = {}
    2. const wrappedGetters = store._wrappedGetters
    3. const computed = {}
2. wrappedGetters遍历，传入fn和key
    1. computed[key]设置为`() => fn[key](this.state)`
    2. Object.defineProperty定义store.getters[key]的get方法：() => store._vm[key]
3. 新vm创建：store._vm = new Vue({ data: { $$state: state }, computed })

### state获取

1. get：直接返回 return this._vm._data.$$state
2. set：报错处理

### commit(_type,_payload, _options)

1. unifyObjectStyle处理传入参数
2. 获取事件列表： const entry = this._mutations[type]
3. this._withCommit包裹forEach遍历entry处理事件
4. this._subscribers遍历触发

### dispatch(_type,_payload)

1. unifyObjectStyle处理传入参数
2. 获取事件列表： const entry = this._actions[type]
3. this.actionSubscribers的before钩子遍历触发
4. entry判断长度获取result
    1. 大于1：Promise.all(entry.map(handler => handler(payload)))
    2. 否则直接返回：`entry[0](payload)`
5. 返回Promise封装的result执行
    1. result.then成功回调：actionSubscribers的after钩子遍历触发
    2. result.then错误回调：actionSubscribers的error钩子遍历触发

## 模块化

### 模块安装

#### Store处理

1. constructor
    1. this._modules = new ModuleCollection(options)
        1. 负责创建各模块层级关系
        2. 通过执行register和对modules遍历执行register完成模块收集和关系处理
    2. installModule(this, state, [], this._modules.root)
        1. 将各模块的属性注册到store上
        2. 例如store._mutations[拼接好层级的key] = 对应的方法

#### ModuleCollection

1. constructor(rawRootModule)：执行this.register([], rawRootModule, false)
2. register(path, rawModule, ...)
    1. 创建新newModule：const newModule = new Module(rawModule, runtime)
    2. path.length判断
        1. path.length为0则设置为root：this.root = newModule
        2. 否则寻找parent，并将newModule，通过parent.addChild添加至parent中
    3. rawModule.modules存在，则遍历每一项执行register注册modules

##### Module

1. constructor(rawModule, runtime)：设置需要的属性
    1. this._children = Object.create(null)
    2. this._rawModule = rawModule
    3. const rawState = rawModule.state
    4. this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
2. 设置children相关方法
    1. addChild
    2. removeChild
    3. getChild
    4. hasChild
    5. forEachChild
3. 遍历属性方法
    1. forEachGetter
    2. forEachAction
    3. forEachMutation

#### installModule

1. namespace获取：store._modules.getNamespace(path)
2. 向store实例上注册对应方法
    1. 注册dispatch、commit、getters与state
    2. store._mutations[key]的key：const namespacedType = namespace + key

### 模块注册（registerModule）

1. this._modules执行传入module的注册： this._modules.register(path, rawModule)
2. 安装模块：installModule(this, this.state, path, this._modules.get(path), options.preserveState)
3. 重置vm触发getter更新：resetStoreVM(this, this.state)

## 其他处理

### 严格模式

#### enableStrictMode

1. `store._vm.$watch`注册对`this._data.$$state`的深度监听
2. store._committing为true时则不执行报错
3. resetStoreVM中store.strict为true启动执行

#### _withCommit

1. const committing = this._committing
2. this._committing = true
3. 执行方法
4. this._committing = committing
5. 当处理一些不需要报错的方法时，用this._withCommit包裹执行

### 辅助函数

1. 分类
    1. mapState
    2. mapMutations
    3. mapGetters
    4. mapActions
2. 都是创建res空对象，获取到对应的处理方法设置到res中返回

### 插件

1. Store的constructor中执行插件注册：plugins.forEach(plugin => plugin(this))
2. 提供状态监听接口
    1. subscribe
    2. subscribeAction
3. 修改状态接口
    1. replaceState
