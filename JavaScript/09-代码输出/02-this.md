# this

这个相关的问题推荐看以下笔记

1. [JavaScript/作用域和闭包/this](../03-作用域和上下文/05-this.md)
2. 记住new绑定 > 显式绑定 > 隐式绑定 > 默认绑定，为指定就是默认绑定window，但是严格模式时undefined

## 01

```js
var a = 10
var obj = {
  a: 20,
  say: () => {
    console.log(this.a)
  }
}
obj.say() 

var anotherObj = { a: 30 } 
obj.say.apply(anotherObj) 

/// 打印结果
// 10
// 10
```

1. 箭头函数的this，来自原其父级所处的上下文，此处obj的上下文为window
2. 箭头函数的this不会变更

## 02

```js
var obj = {
  name: 'cuggz', 
  fun: function(){
     console.log(this.name); 
  }
} 
obj.fun()
new obj.fun()

/// 打印结果
// cuggz
// undefined // 此处的this指向new生成的对象
```

## 03

```js
window.number = 2;
var obj = {
 number: 3,
 db1: (function(){
   this.number *= 4;
   return function(){
     this.number *= 5;
   }
 })()
}
var db1 = obj.db1;
db1();
obj.db1();
console.log(obj.number);     
console.log(window.number);  

/// 打印结果
// 15
// 40
```

1. db1未自执行函数，声明就会执行，同时未指定this绑定，则此时的this为window，window.number * 4
2. db1()执行时，未指定this，则this还是window，window.number * 5
3. obj.db1()，指定了this未obj，obj.number * 3

## 04

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

## 05

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

## 06

```js
function a(xx){
  this.x = xx;
  return this
};
var x = a(5); // 此时x先变成5再变成window
var y = a(6); // 此时x又变成5，y变成window

console.log(x.x)  // undefined
console.log(y.x)  // 6
```

## 07

```js
function foo(something){
    this.a = something
}

var obj1 = {}

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
// new绑定 > 显式绑定 > 隐式绑定 > 默认绑定
```
