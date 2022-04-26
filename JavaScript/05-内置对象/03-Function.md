# Function

## 概念

### 函数是一等公民

每个 JavaScript 函数实际上都是一个 Function 对象
1. 可以存储在变量中
2. 可以作为参数
3. 可以作为返回值

并且与对象相比，普通函数具有显式原型prototype

### 函数声明方式

1. function fn() {}：函数提升，提升的同时会进行赋值
2. var fn = function () {}：变量提升，var声明只会初始化为undefined，let和const则是不会初始化

## [箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### 箭头函数特点

1. 都是匿名函数，设计时就认定为一种更加纯粹的函数
   1. 没有属于自己的arguments、super、new.target
   2. 不可以作为generator函数使用
   3. 没有自己的显式原型prototype
2. 箭头函数内部没有自己this，声明时获取
   1. 箭头函数内部使用this时看上去更像闭包，Babel的编译结果就是闭包处理
   2. 不能用call/apply/bind去改变this指向
3. 箭头函数不能使用new

### 箭头函数可以使用Function方法的原因

1. 箭头函数的`__protp__`等价于Function.prototype
2. 方法的Function.prototype具有函数的方法

## 严格模式（use strict）

ECMAscript5 添加的（严格模式）运行模式

### 严格模式目的

1. 消除Javascript语法的不合理、不严谨之处，减少怪异行为
2. 消除代码运行的不安全之处，保证代码运行的安全
3. 提高编译器效率，增加运行速度
4. 为未来新版本的Javascript做好铺垫

### 严格模式区别

1. 禁止使用 with 语句
2. 禁止this关键字指向全局对象
3. 对象不能有重名的属性

### 尾调用

1. 函数在执行栈中运行，函数a中调用函数b，则保留a的上下并创建b的上下文插入栈中
2. 尾调用就是在函数执行的结尾调用另一个函数

#### 尾调用优化

1. 严格模式可以开启
2. 当函数尾调用时，则调用函数的上下文不会保留，可以节省内存

## 函数式编程

### 相关概念

#### 使用原因

1. 随React的流行受到关注，同时vue3开始拥抱函数式编程
2. 可以抛弃this
3. 打包过程中更好利用tree sharking
4. 测试和并行处理方便
5. 很多库方便函数式开发

#### 编程范式

1. 面向过程：按照步骤实现
2. 面向对象：事物抽象为类和对象，通过封装，继承，多态演示联系
3. 函数式：事物之间的联系抽象到编程
   1. 函数式的函数不是程序中的函数方法，是数学的映射关系
   2. 相同输入得到相同输出

#### 高阶函数

1. 函数作为参数，并且函数作为返回结果的函数
1. 帮助我们屏蔽细节，抽象通用的问题
2. 使用灵活

#### [纯函数](https://cloud.tencent.com/developer/article/1857193?from=article.detail.1629653)

1. 相同输入永远会得到相同输出
2. 没有可以观察的副作用

例如lodash中的FP模块就全是纯函数

##### 纯函数优势

1. 可缓存（lodash的memoize）
2. 可测试
3. 并行处理，多线程操作共享内存数据会出现意外，纯函数不会访问共享数据

##### 纯函数副作用

1. 函数依赖外部状态，无法保证输出相同则会有副作用
2. 纯函数存在硬编码问题

#### 闭包和柯里化：[详见JavaScript/作用域和闭包/闭包](../03-作用域和闭包/03-闭包.md)

### 函数组合

1. 使用纯函数和柯里化很容易写出洋葱代码，即一层包一层的代码
2. 函数组合则是将多个细粒度函数组成一个新函数
3. 函数组合具有结合律
   1. 即多个函数组合，只要组合顺序不变，如何组合结果都一样
   2. c(c(x, y), z) 等价于 c(x, c(y, z))

lodash中的组合函数为flow和flowRight

#### 函数组合原理

1. 将一个复杂函数拆分成多个简单函数
2. 每个方法的结果就是下一个函数的结果
3. 然后使用组合函数将传入函数组合

```js
(...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)
```

### [函子](https://segmentfault.com/a/1190000023744960)

#### 函子概念

1. 容器：包含值和值的变形关系(这个变形关系就是函数)
2. 函子：是一个特殊的容器
   1. 通过一个普通的对象来实现
   2. 该对象具有 map 方法，map可以运行一个函数对值进行处理(变形关系)
3. 使用函子需要避免外部使用new

```js
class Container {
    //使用类的静态方法，of替代了new Container的作用
    static of (value) {
        return new Container(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}
const r = Container.of(5)
    .map(x => x + 2) // 7
    .map(x => x ** 2) // 49
console.log(r) // Container { _value: 49 }
```
