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

### 对象拓展：不可增加属性

1. Object.isExtensible()
2. Object.preventExtensions()

### 对象密封：不可增删属性，同时不可以修改已有属性的可枚举性、可配置性、可写性

1. Object.isSealed()
2. Object.seal()

### 对象冻结：密封基础上增加了不可修改，冻结只能浅层冻结

1. Object.isFrozen()
2. Object.freeze()

## 创建对象

### new Object()

1. 等价于字面量创建{}
2. 默认原型是Object.prototype
3. 传入对象则会返回对象本身

### Object.create()

1. 第一个参数是指定的原型对象
2. 第二个参数是可选参数，给新对象自身添加新属性以及描述器

#### Object.create(null)作用

1. 使用字面量创建会有很多对象内置写好的原型，而Object.create(null)是使用null作为原型
2. 这种创建出来的对象相对较干净，不用担心重名和被原生原型影响，可以用作数据字典
3. 减少了hasOwnProperty的性能损失

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

####  JSON.stringify()

```js
// 拷贝的对象中如果有函数，undefined，symbol，则会丢失
let obj2 = JSON.parse(JSON.stringify(obj1));
```

#### lodash的_.cloneDeep方法

### 深浅拷贝实现

1. 判断newObj的类型，数组还是对象，设置空值
2. for...in遍历obj，hasOwnProperty过滤原型属性
3. newObj赋值，当设置的值为对象并且deep为true，则嵌套调用objectCopy

详见手写代码/对象相关

## 删除对象delete

但是这种删除方式性能不好
1. 推荐使用设置undefined或null替代
2. 大量增删，推荐Map
