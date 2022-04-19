# this

[this-思维导图](./mind/05-this.html)

## this概念

### this和词法作用域不要混淆

1. this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件
2. this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式

### 调用位置

1. 分析this需要明确调用位置
2. 调用位置就是函数在代码中被调用的位置（而不是声明的位置）

## 绑定规则

### 绑定规则优先级（new > 显式绑定 > 隐式绑定 > 默认绑定）

### 默认绑定

1. 直接使用不带任何修饰的函数引用进行调用的函数指向默认绑定
2. 函数默认绑定时，this指向全局对象
3. 严格模式下，默认模式不可用，this为undefined

```js
function foo() {
    console.log(this.a);
}
var a = 2;
foo(); // 2
```

### 隐式绑定

1. 隐式绑定是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含
2. 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象

```js
function foo() {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo(); // 2
```

#### 隐式丢失

```js
// 隐式绑定只取决于是否存在有上下文对象，与函数无关
function foo() {
    console.log(this.a);
}

function doFoo(fn) {
    // fn 其实引用的是 foo
    fn(); // <-- 调用位置！
}
var obj = {
    a: 2,
    foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo(obj.foo); // "oops, global"
```

### 显式绑定

1. 利用call，apply和bind强行指定this的绑定对象
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
// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach(foo, obj);
// 1 awesome 2 awesome 3 awesome
```

#### call，apply和bind原理：[详见JavaScript/手写代码/函数相关](/JavaScript/08-代码手写/03-函数相关.md)

1. call传入两个参数(context, ...args)
   1. context因为默认绑定存在，未设置则window
   2. 否则将context.fn设置为this，并执行返回res（记得delete删除fn）
2. apply就是直接对call封装，将传入的第二个参数展开
3. bing利用闭包，返回一个处理函数Fn
   1. 首先判断context，当this instanceof Fn时，则context为this，否则不变
   2. 利用apply绑定context执行，（记得传入的参数合并bind和Fn的共同参数）

### new绑定：[详见JavaScript/手写代码/对象相关](/JavaScript/08-代码手写/01-对象相关.md)

1. 首先创建了一个新的空对象
2. 设置原型，将对象的原型设置为函数的 prototype 对象
3. 让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
4. 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象

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
var bar = foo.call(obj1);
// 箭头函数的this并没有变动
bar.call(obj2); // 2, 不是 3 ！
```

### 针对箭头函数的this有以下特点

1. 创建箭头函数时，创建它的上下文的this就是箭头函数的this
2. 箭头函数的this无法修改绑定（new也不可以）

## 相关题目

题目一

```js
// 隐式绑定，只看方法从哪获取的
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
