# Object

一种无序的数据集合，其键值必须为String或Symbol或数值

## 访问属性

```js
// 点语法
obj.key
// 中括号
obj['key']
```

## 对象特性

### 禁止扩展：保留已有属性并禁止添加

1. Object.isExtensible()
2. Object.preventExtensions()

### 对象密封：preventExtensions基础上，将属性标记为configurable:false

1. Object.isSealed()
2. Object.seal()

### 对象冻结：seal的基础上，将属性标记为writable:false

1. Object.isFrozen()
2. Object.freeze()

## 创建对象

### new Object()

1. 等价于字面量创建{}
2. 默认原型是Object.prototype
3. 传入对象则会返回对象本身

### Object.create()

1. 第一个参数是指定隐式原型对象
2. 第二个参数是可选参数，给新对象自身添加新属性以及描述器
3. 原理[详见JavaScript/手写代码/对象相关](../08-代码手写/01-对象相关.md)

#### Object.create(null)

1. 使用字面量创建会有很多对象内置写好的原型，而Object.create(null)是使用null作为原型
2. 这种创建出来的对象相对较干净，不用担心重名和被原生原型影响，可以用作数据字典
3. 减少了hasOwnProperty的性能损失

#### Object.setPrototypeOf(Bar.prototype, Foo.prototype)

1. ES6新增，标准并且可靠的方法来修改关联
2. Object.create()会使被赋值的函数原型被替代
3. Object.setPrototypeOf则是只是建立链接关系
4. 但是Object.setPrototypeOf兼容性不太好
5. 忽略掉Object.create方法带来的轻微性能损失，它更短而且可读性更高

## 遍历对象

### 对象属性分类

1. 原型属性
2. 对象自身
3. Symbol属性

### 判断是否可枚举

1. Object.getOwnPropertyDescriptor()
2. Object.prototype.propertyIsEnumerable()
    1. true，则自有属性且可枚举
    2. false
        1. 原型属性
        2. 不可枚举
        3. 属性是方法返回false

### 遍历方式

1. for...in
    1. 遍历范围
        1. 包含：对象自身可枚举 + 原型属性中可枚举
        2. 不包含：对象自身不可枚举 + Symbol属性 + 原型属性中不可枚举
        3. Object.prototype.hasOwnProperty过滤原型链属性
    2. 遍历顺序
        1. 大于等于0的整数，按照大小排序，小数和负数按照string处理
        2. string按照定义顺序输出
        3. Symbol过滤，不输出
2. Object.keys()（ES5）
    1. 遍历范围
        1. 包含：对象自身可枚举
        2. 不包含：原型属性 + 对象自身不可枚举 + Symbol属性
    2. 遍历顺序
        1. 与for...in相同
3. Object.getOwnPropertyNames()（ES5）
    1. 遍历范围
        1. 包含：对象自身可枚举 + 对象自身不可枚举
        2. 不包含：原型属性 + Symbol属性
4. Object.getOwnPropertySymbols()（ES6）
    1. 遍历范围
        1. 包含：对象自身Symbol属性
        2. 不包含：原型属性 + 对象自身非Symbol属性
5. Reflect.ownKeys()（ES6）
    1. 遍历范围
        1. 包含：对象自身所有属性，包括不可枚举和Symbol属性
        2. 不包含：原型属性

## 拷贝对象

### 浅拷贝

#### assgin

```js
Object.assgin(target, source, ...)
```

##### 参数

1. target目标对象（作为返回的对象）
2. source拷贝对象

##### 特点

1. 存在同名属性，则后面的覆盖前面的
2. 第一个参数不能为null和undefined，因为无法转化为对象

#### 扩展运算符

```js
let copyObj = {
    ...obj1
}
```

#### 数组浅拷贝

1. Array.prototype.slice
2. Array.prototype.concat

### 深拷贝

#### JSON.stringify()

```js
// 拷贝的对象中如果有函数，undefined，symbol，则会丢失
let obj2 = JSON.parse(JSON.stringify(obj1));
```

#### lodash的_.cloneDeep方法

### 深浅拷贝实现：[详见手写代码/对象相关](../08-代码手写/01-对象相关.md)

1. 判断newObj的类型，数组还是对象，设置空值
2. for...in遍历obj，hasOwnProperty过滤原型属性
3. newObj赋值，当设置的值为对象并且deep为true，则嵌套调用objectCopy

## 属性删除

1. 利用delete操作符可以删除对象中属性
2. 但是这种删除方式性能不好，推荐使用设置undefined或null替代
3. 大量增删，推荐Map替代Object
