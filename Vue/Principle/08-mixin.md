# mixin

1. Vue.mixin处理当前实例的默认配置设置属性，位于GlobalAPI设置

## Vue.mixin(mixin)

1. 利用mergeOptions合并配置：this.options = mergeOptions(this.options, mixin)
2. 返回this

## mergeOptions(parent, child, vm)

1. 标准化child属性为Object-based形式
    1. normalizeProps(child, vm)
    2. normalizeInject(child, vm)
    3. normalizeDirectives(child)
2. child._base不存在
    1. child.extends存在，则parent = mergeOptions(parent, child.extends, vm)
    2. child.mixins存在，则遍历mixins，执行parent = mergeOptions(parent, child.mixins[i], vm)
    3. 即extends类似于单属性继承，mixins则是多属性增加
3. 创建合并的options
4. for (key in parent)，执行mergeField(key)
5. for (key in child)，如果parent不存在这个key，则mergeField(key)
6. mergeField(key)
    1. 获取合并策略：strats[key] || defaultStrat
    2. 按照策略合并options：options[key] = strat(parent[key], child[key], vm, key)
7. 返回options

### 合并策略

#### defaultStrat(parentVal, childVal)

1. 默认的合并策略：childVal优先
2. childVal === undefined ? parentVal : childVal

#### mergeAssets(parentVal, childVal, vm, key)

1. assets合并策略：创建一个对象，将parentVal设置为`__proto__`，childVal浅复制到对象
    1. component
    2. directive
    3. filter
2. parentVal设置为res的`__proto__`：const res = Object.create(parentVal || null)
3. childVal存在，则执行extend(res, childVal)，将childVal的属性通过for...in循环定义到res，即浅拷贝
4. 返回res

#### mergeHook(parentVal, childVal)

1. 钩子的合并策略：将parentVal与childVal合并到一个数组中
    1. 生命周期钩子函数
    2. errorCaptured
    3. serverPrefetch
2. parentVal和childVal都存在，则直接返回parentVal.concat(childVal)
3. parentVal不存在，则Array.isArray(childVal) ? childVal : [childVal]
4. childVal不存在，返回parentVal
5. 利用dedupeHooks将res复制一份并返回

## Vue.extend、Vue.mixin、mixins与extends的优先级

1. Vue.extend用于创建一个组件构造
2. Vue.mixin为Vue的构造器添加基础配置
3. mixins传入数组，实例的多继承
4. extends传入对象或方法，实例的单继承
5. 全局Vue.mixin > Vue.extend > 组件Vue.mixin > extends > mixins，即先注册先执行
