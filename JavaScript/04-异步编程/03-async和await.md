# async和await

async和await是ES2017添加，一种对Promise和generator封装的语法糖

## 相互关系

### 与Promise关系

1. async：会将函数封装成Promise.resolve对象
2. await：后续代码等价于Promise的then
3. try...catch：等价于Promise的catch

### 与generator关系

1. await替代yield
2. 自带生成器执行器

#### 与generator的区别

1. async/await自带执行器，不需要手动调用next()
2. async函数返回值是Promise对象，而Generator返回的是生成器对象

## Iterator

Symbol.iterator可以获取迭代器，对迭代器调用next方法获取迭代值

### 是否支持await的遍历

1. 同步遍历（不支持await）
   1. for...in
   2. forEach
2. 异步遍历
   1. for...of

#### for...in

```js
for (variable in object)
    statement
```

1. 仅迭代自身的属性，使用 getOwnPropertyNames() 或执行 hasOwnProperty() 来确定某属性是否是对象本身的属性
2. for ... in是为遍历对象属性而构建的，不建议与数组一起使用

#### for...of

```js
for (variable of iterable) {
    //statements
}
```

##### 处理支持for...of

1. 目标具有Symbol.iterator属性，才可以被遍历
2. 类数组对象则直接Array.from转成数组
3. 对象增加Symbol.iterator方法，返回具有next方法的对象并且对象next方法返回具有value和done的对象
4. 利用生成器，由于执行 Generator 函数实际返回的是一个遍历器，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口

#### for...of与for...in差异

1. 获取值
   1. for…in 获取的是对象的键名
   2. for…of 遍历获取的是对象的键值
2. 遍历范围
   1. for…in 会遍历对象的整个原型链
   2. for…of 只遍历当前对象的自有属性
3. 数组遍历
   1. for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)
   2. for…of 只返回数组的下标对应的属性值

## [Generator](https://www.cnblogs.com/rogerwu/p/10764046.html)

生成器对象是由一个 generator function 返回的, 并且它符合可迭代协议和迭代器协议

### 生成器语法

#### 创建生成器

```js
function* generator()
```

1. function关键字与函数名之间有一个星号
2. Generator函数并不会执行，而是返回一个生成器对象
3. 调用next执行到下一个yield

#### yield

1. 使用yield表达式，定义不同的内部状态
2. 执行完一条yield语句后函数就会自动停止执行，直到再次调用next()
3. yield*，则可以Generator函数里面调用另一个Generator 函数

### 生成器方法

#### Generator.prototype.next()

依次遍历Generator函数内部的每一个yield中断的状态

返回值为{value: 14, done: false}

#### Generator.prototype.return()

返回给定的值并结束生成器

#### Generator.prototype.throw()

向生成器抛出一个错误

### 执行器：[详见JavaScript/手写代码/异步编程](../08-代码手写/04-异步编程.md)

1. 接收生成器函数
2. 自动执行next，将生成器函数执行完毕
