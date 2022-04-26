# this

## this概念

1. this是在运行时进行绑定的，并不是在编写时绑定，详见[JavaScript/作用域和闭包/执行上下文](./04-执行上下文.md)
2. this的绑定和函数声明的位置无关，只取决于函数的调用位置
   1. 分析this需要明确调用位置
   2. 调用位置就是函数在代码中被调用的位置（而不是声明的位置）

## 绑定规则

### 绑定规则优先级

1. new
2. 显式绑定
3. 隐式绑定
4. 默认绑定）

### 默认绑定

1. 不带任何修饰的函数引用进行调用的函数指向默认绑定
2. 函数默认绑定时，this指向全局对象
3. 严格模式下，默认模式不可用，this为undefined

```js
function foo() {
    console.log(this.a)
}
var a = 2
foo() // 2
```

### 隐式绑定

1. 隐式绑定是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含
2. 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象

```js
function foo() {
    console.log(this.a)
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo() // 2
```

#### 隐式丢失

```js
// 隐式绑定只取决于是否存在有上下文对象，与函数无关
function foo() {
    console.log(this.a)
}

function doFoo(fn) {
    // fn 其实引用的是 foo
    fn() // <-- 调用位置！
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global" // a 是全局对象的属性
doFoo(obj.foo) // "oops, global"
```

### 显式绑定

1. 利用call，apply和bind等强行指定this的绑定对象
2. 显式绑定的硬绑定特性解决了之前this恢复默认绑定问题
3. 部分内置函数提供参数，支持上下文context绑定
4. 显示绑定对象为null，或者undefined则执行默认绑定

```js
function foo(el) {
    console.log(el, this.id);
}
var obj = {
    id: "awesome"
};
// forEach第二个参数为绑定执行函数的this，不设置为undefined
[1, 2, 3].forEach(foo, obj);
// 1 awesome 2 awesome 3 awesome
```

#### call，apply和bind原理

1. 详见[JavaScript/手写代码/函数相关](../08-代码手写/03-函数相关.md)
2. call传入两个参数(context, ...args)
   1. context因为默认绑定存在，未设置则window
   2. 否则将context.fn设置为this，并执行返回res
   3. delete删除对象上的fn
3. apply就是直接对call封装，将传入的第二个参数展开
4. bing利用闭包，返回一个处理函数Fn
   1. 首先判断context
      1. 当this instanceof Fn时，说明使用new调用函数，则context为this
      2. 否则context保持不变
   2. 利用apply绑定context执行，传入的参数需要合并bind和Fn的共同参数

### new绑定

1. 详见[JavaScript/手写代码/对象相关](../08-代码手写/01-对象相关.md)
2. 创建了一个新的空对象
3. 将对象的`__proto__`设置为函数的prototype对象
4. 利用call将函数的this指向这个对象并执行
5. 判断函数的返回值类型
   1. 如果是值类型，返回创建的对象
   2. 如果是引用类型，就返回这个引用类型的对象

## 箭头函数

```js
function foo() {
    return () => console.log(this.a);
}
var obj1 = {
    a: 2
};
var obj2 = {
    a: 3
};
// 将执行foo的this指向obj1，并获得返回箭头函数bar
var bar = foo.call(obj1)
// 箭头函数的this并没有变动
bar.call(obj2); // 2, 不是 3 ！
```

### 针对箭头函数的this有以下特点

1. 创建箭头函数时，创建它的上下文的this就是箭头函数的this
2. 箭头函数的this无法修改绑定（new也不可以）

## 相关题目

题目一

```js
var length = 1

function foo() {
    console.log(this.length)
}
var arr = [foo, 2, 3, 4]
arr[0]() // 隐式绑定 this -> arr2 -> 4
var fn = arr[0]
fn() // 默认绑定 this -> window -> 1
```

题目二

```js
var length = 1

function fn() {
    console.log(this.length)
}
var obj = {
    length: 100,
    action: function(callback) {
        callback() // window => 1
        arguments[0]() // arguments => 5
        var foo = arguments[0]
        foo() // window => 1
        this.foo2 = arguments[0]
        this.foo2() // obj => 100
    }
}
var arr1 = [1, 2, 3, 4]
obj.action(fn, ...arr1)
```
