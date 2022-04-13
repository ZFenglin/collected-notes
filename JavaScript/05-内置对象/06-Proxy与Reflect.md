# Proxy与Reflect

## [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

用于创建一个对象的代理对象，实现基本操作的拦截和自定义

### Proxy使用

```js
const p = new Proxy(target, handler)
```

#### target：要使用Proxy包装的目标对象

#### handler

代理的处理对象

01. handler.getPrototypeOf()
02. handler.setPrototypeOf()
03. handler.isExtensible()
04. handler.preventExtensions()
05. handler.getOwnPropertyDescriptor()
06. handler.defineProperty()
07. handler.ownKeys()：Object.getOwnPropertyNames方法和Object.getOwnPropertySymbols方法的捕捉器
08. handler.has()：in的捕捉器
09. handler.get()
10. handler.set()
11. handler.deleteProperty()：delete的捕捉器
12. handler.apply()：函数调用捕捉器
13. handler.construct()：new的捕捉器

### Proxy对比defineProperty

01. 能监视更多对象操作
02. 更好的对数组进行监视
03. 是以非侵入的方式对对象进行监视
04. 对于Vue，使用Proxy无需一层层递归为每个属性添加代理，性能更好
05. 同时Proxy 可以完美监听到任何方式的数据改变，唯一缺陷就是浏览器的兼容性不好

```js
let onWatch = (obj, setBind, getLogger) => {
    let handler = {
        get(target, property, receiver) {
            getLogger(target, property)
            return Reflect.get(target, property, receiver)
        },
        set(target, property, value, receiver) {
            setBind(value, property)
            return Reflect.set(target, property, value)
        }
    }
    return new Proxy(obj, handler)
}
```

## Reflect

01. Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法
02. Reflect不是一个函数对象，因此它是不可构造的
03. Reflect的所有属性和方法都是静态的

### Reflect作用

01. Reflect封装了一系列对对象的底层操作，可以用作Proxy处理对象的默认实现
02. 提供了一套用于操作对象的方法，以后可能取代in，delete等方法
