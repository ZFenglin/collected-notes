---
theme: smartblue
---
# Vue3响应系统的基本实现

## 写在开头

上周提到《Vue.js设计与实现》这本书，首先介绍的是Vue3在设计的时候框架作者的考量和权衡。其实许多我们所不在意的部分都蕴含着作者的深度思考（感兴趣的同学可以看上周的文章，链接在末尾）。这周的话就来到了我们特别重要的的响应系统了（毕竟响应式的改动是Vue3最受关注的特征之一）。我打算遵循书中的顺序，只介绍些我认为比较重要的部分，而一些细致的修改我只会一概而过。首先从如何实现一个基本的响应式系统开始吧。

## 基本实现

### 组成部分

书中将一个基本的响应式划分为两个部分

1. 副作用函数effect
    1. 内部会对响应式数据进行获取或操作
    2. 该函数的执行会直接或间接影响其他函数的执行，如修改了全局变量
2. 响应式数据
    1. 当数据被effect函数获取或操作时effect函数是会被收集的
    2. 当数据更新时会触发对应的effect函数

从描述中我们可以看出，关于响应式是需要一个容器专门收集响应式数据和effect的函数之间的依赖关系，书中以名为bucket的容器来进行收集。

### 简易实现

从上述的组成部分来说，一个简单的响应式需要以下几点

1. effect执行时会触发响应式对象的读取
2. 响应式对象的读取会触发bucket的收集effect函数
3. 响应式对象的修改会触发bucket获取对应的effect函数并执行

以下是一个简易的实现

```js
const bucket = new Set() // 使用set防止重复收集
// 创建响应式对象
const data = { text: 'hello' }
const obj = new Proxy(data, {
    get(target, key) {
        bucket.add(effect) // 收集effect
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        bucket.forEach(fn => fn()) // 遍历执行effect
        return true
    }
})
// 创建effect函数
const effect = function () {
    console.log(obj.text)
}
// 测试
effect()
obj.text = 'hello vue3'
// hello
// hello vue3
```

当然，从实现也能看出一些十分明显的问题：

1. effect如果是匿名函数怎么进行收集
2. bucket的收集并不是按照effect与响应式对象之间的关系进行收集

接下来我们将对这个响应式系统进行完善。

### 系统完善

#### 匿名effect函数无法收集

首先针对匿名的effect的处理，作者将从两个方面处理：

1. **effect函数抽离**成一个专门处理执行对响应式对象读取和操作的函数的函数
2. 设置一个**全局的activeEffect**用于收集当前执行的函数

```js
// effect函数创建
let activeEffect
function effect(fn) {
    if (fn && typeof fn === 'function') {
        activeEffect = fn
        fn()
    }
}
// 响应式对象修改
// ...
activeEffect && bucket.add(activeEffect) // get中收集时修改收集目标
// ...
// effect使用
effect(() => console.log(obj.text))
```

#### 副作用函数和目标未建立联系

关于如何在bucket收集effect的时候同时建立其与响应式的对象的联系，作者提出了修改bucket结构的方式，即**WeakMap => Map => Set**

1. WeackMap
    1. Key为target，value为收集的map
    1. 使用**WeakMap是为了当响应式对象target丢失时，收集的依赖会自动销毁**
2. Map
    1. Key为key，Value为收集effect的set
3. Set
    1. 存储effect函数，并**利用Set特性防止重复执行**

当然为了后续的简单使用和概念清晰，**将收集effect的代码和执行effect代码抽离为track与trigger**

```js
// 依赖关系收集处理
const bucket = new WeakMap()
function track(target, key) {
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) bucket.set(target, (depsMap = new Map()))
    let deps = depsMap.get(key)
    if (!deps) depsMap.set(key, (deps = new Set()))
    deps.add(activeEffect)
}
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
}
// 响应式对象处理
const data = { text: 'hello' }
const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})
// 测试
effect(() => console.log('effect1', obj.text))
effect(() => console.log('effect2', obj.text))
obj.text = 'hello vue3'
// effect1 hello
// effect2 hello
// effect1 hello vue3
// effect2 hello vue3
```

## 剩余完善

这里算是对响应式处理的剩余功能与问题的修补，这里我就只是简单进行介绍。感兴趣的同学可以去看看书籍或者其他相关文章吧。

首先处理分为以下几种

1. 分支切换问题
2. 嵌套effect问题
3. 无限递归问题
4. 调度执行支持（这个我准备放在后续的computed和watch实现中解释）

### 分支切换

```js
// obj.ok默认为true
effect(() => document.body.innerText = obj.ok ? obj.text : 'none')
```

当将obj.ok的值修改为true时，但是由于关于obj.text的依赖以收集该effect，所以当修改obj.text的值时仍会触发effect函数。这样当然是不行的，所以作者提出以下的修改方式：

1. effect处理
    1. 将原先的代码放至effectFn函数中
        1. cleanup(effectFn)
        2. activeEffect = effectFn
        3. fn()
    2. 设置effectFn.deps = []
    3. 执行effectFn
2. track处理
    1. 函数结尾增加activeEffect.deps.push(deps)
3. cleanup函数
    1. 遍历effectFn.deps
        1. 获取每一项deps
        2. deps执行delete删除effectFn
    2. effectFn.deps的length设置为0

但是还存在一个无限循环的问题，主要是trigger中执行fn的过程中，cleanup的删除在同步执行，其实等价于以下情况：

```js
// 遍历的过程中边删边添加会造成无限重复执行
const set = new Set([1])
set.forEach(value => {
    set.delete(1)
    set.add(1)
    console.log('遍历中')
})
```

所以作者的处理方式就是在**trigger中将effects复制一份effectsToRun，通过遍历effectsToRun替代effects**。

### 嵌套effect

```js
effect(function effect1() {
    effect(function effect2() {
        console.log('effect2', obj.bar)
    })
    console.log('effect1', obj.foo)
})
```

当effect进行嵌套时，比如effect1内部执行effect2。当effect1内部首先执行effect2，此时**activeEffect就会由effect1的依赖函数替换为effect2的**。当effect2处理完成后，activeEffect仍然时effect2的，所以**后续的代码无法收集到effect1的依赖函数**，造成收集错误。

但是处理方式与Vue2中watcher的收集差不多，按照以下步骤：

1. 设置一个effectStack栈
2. fn执行前
    1. activeEffect设置为effectFn
    2. effectFn入栈
3. fn执行后
    1. effectStack推出队尾并设置为activeEffect

### 无限递归

```js
effect(() => {
    obj.foo = obj.foo + 1
})
```

当在effect传入的的函数同时发生了对响应对象的修改，从而造成对象修改和effect函数执行的无限递归。

其实处理方式就是在trigger执行时，之前为了处理分支切换时备份了一份effectsToRun，此时修改为**遍历effects，当遍历的某一项和当前的activeEffect相同时就不再添加至effectsToRun中**，从而解决的无限递归的问题。

## 写在结束

本周拖拖拉拉又是在最后时刻将文章挤出来了（这是懒病要改啊）。下周公司又开始繁忙起来了，目标就是下周能把computed和watch相关的写出来吧。其他的也没什么好说的，希望看到本文的人能有所收益吧(有问题大家也要指出来啊，我们共同进步)。

在此祝大家下周工作和生活愉快，我是爱摸鱼的枫林，下周再见！！！

## 相关链接

[《Vue.js的设计与实现》之框架设计](https://juejin.cn/post/7121319114441752613)
