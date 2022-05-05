# component

## component声明

### Vue.component(id, definition)

1. GlobalAPI时，initAssetRegisters中处理，其中也会处理directive与filter

#### initAssetRegisters(Vue)

1. 遍历ASSET_TYPES = ['component', 'directive', 'filter']
2. type === 'component' && isPlainObject(definition)
    1. 组件名称定义：definition.name = definition.name || id
    2. 执行Vue.extend处理继承：definition = this.options._base.extend(definition)
3. 将definition定义到Vue.options.components上：this.options[type + 's'][id] = definition
4. 返回definition

### Vue.extend(extendOptions)

1. 获取Super与SuperId
    1. const Super = this
    2. const SuperId = Super.cid
2. 检查是否存在缓存，存在直接返回cachedCtors[SuperId]
3. 定义Sub：function VueComponent(options) { this._init(options) }
4. Sub继承处理（寄生组合式继承）
    1. Sub.prototype = Object.create(Super.prototype)
    2. Sub.prototype.constructor = Sub
5. 组件和Vue采用mergeAssets策略合并配置：Sub.options = mergeOptions(Super.options, extendOptions)
6. Sub.xx属性处理
    1. Sub.cid = cid++
    2. Sub['super'] = Super
    3. Sub.extend = Super.extend
    4. Sub.mixin = Super.mixin
    5. Sub.use = Super.use
    6. ASSET_TYPES属性设置
7. name获取和自调用设置：Sub.options.components[name] = Sub
8. 缓存组件：cachedCtors[SuperId] = Sub
9. 返回Sub

## component挂载

1. component挂载推荐先看元素挂载（详见[元素挂载](./07-%E5%85%83%E7%B4%A0%E6%8C%82%E8%BD%BD.md)）
2. 当_createElement执行遇到组件时，会执行createComponent处理获取组件vnode
3. 当createElm执行遇到组件，则执行createComponent创建组件元素
4. 注意这两个createComponent并不是一个方法

### createComponent(Ctor, data, context, children, tag): vnode

1. Ctor是对象，则执行context.$options._base.extend(Ctor)将Ctor更改为构造函数
2. 执行installComponentHooks(data)，将组件相关钩子设置到data上
    1. 获取hooks：const hooks = data.hook || (data.hook = {})
    2. 遍历hooksToMerge，设置组件钩子
        1. init(vnode, hydrating)
            1. 组件实例生成：createComponentInstanceForVnode执行获取实例child并赋值到vnode.componentInstance
            2. 组件挂载：child.$mount(hydrating ? vnode.elm : undefined, hydrating)
        2. prepatch(oldVnode, vnode)
        3. insert(vnode)
        4. destroy(vnode)
    3. 合并策略：如果出现重名，则将两个方法封装到一个方法中执行
3. 创建并返回Vnode实例：``new VNode(`vue-component-${Ctor.cid}${name ?`-${name}`: ''}`, data, ...)``

### createComponent(vnode, insertedVnodeQueue, parentElm, refElm): boolean

1. let i = vnode.data
2. 判断获取钩子并执行：(isDef(i = i.hook) && isDef(i = i.init))&&i(vnode, false)
3. 返回vnode.componentInstance是否存在（createElm中会判断返回值决定是否执行下去）
