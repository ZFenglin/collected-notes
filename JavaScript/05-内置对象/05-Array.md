# Array

有序的数据集合

## 数组方法

### 纯函数

1. map
2. filter
3. concat（数组浅拷贝）
4. slice

##### slice

切片数组，可用作数组浅拷贝

参数
1. start
2. end
3. 参数值为负数则表示从右边开始

### 非纯函数

#### 修改原数组

1. pop
2. push
3. shift
4. unshift
5. sort
6. splice
7. flat

##### splice

剪接数组

参数
1. start
2. count
3. 之后是添加进数组的数值

返回值为被删除的部分

#### 返回结果不正确

1. forEach
2. some
3. every
4. reduce

## 类数组对象

具有length属性和索引属性的对象，但是没有数组常见的方法

### 常见类数组对象

1. arguments
2. DOM方法返回值

### 转化方式

1. Array.from(arrayLike);
2. Array.prototype.slice.call(arrayLike);
3. Array.prototype.concat.apply([], arrayLike);
4. Array.prototype.splice.call(arrayLike, 0);

## 数组去重

### ES6

利用Set可以快速去重

```JS
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];
Array.from(new Set(array)); // [1, 2, 3, 5, 9, 8]
```

### ES5

```JS
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];
uniqueArray(array); // [1, 2, 3, 5, 9, 8]
function uniqueArray(array) {
    let map = {};
    let res = [];
    for (var i = 0; i < array.length; i++) {
        if (!map.hasOwnProperty([array[i]])) {
            map[array[i]] = 1;
            res.push(array[i]);
        }
    }
    return res;
}
```

## 数组扁平化

### flat

arr.flat可以传入设定展开深度作为参数，Infinity为全展开

```JS
function flatten(arr) {
    // Infinity为全展开
    return arr.flat(Infinity);
}
```

###  字符串

通过数组转化为字符串的形式处理展开

#### split 和 toString

```JS
function flatten(arr) {
    return arr.toString().split(',');
}
```

#### 正则和 JSON 方法

```JS
function flatten(arr) {
    let str = JSON.stringify(arr);
    str = str.replace(/(\[|\])/g, '');
    str = '[' + str + ']';
    return JSON.parse(str);
}
```

### concat递归实现

concat每次会展开一层

#### 递归

```JS
function flatten(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}
```

#### reduce

```JS
function flatten(arr) {
    return arr.reduce(function(prev, next) {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
```

### 扩展运算符

不断检测是否存在数组，然后使用拓展运算符不断展开

```JS
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```

## 手写数组方法

```JS
/**
 * 手写flat
 * @param {Array} arr 
 * @param {Number} depth 
 * @returns 
 */
Array.prototype._flat = function(depth = 1) {
    if (!Array.isArray(this) || depth <= 0) return this
    return this.reduce(function(pre, cur) {
        return pre.concat(Array.isArray(cur) ? Array.prototype._flat.call(cur, depth - 1) : cur)
    }, [])
}
/**
 * 手写push 
 */
Array.prototype._push = function() {
    for (let i = 0; i < arguments.length; i++) {
        this[this.length] = arguments[i];
    }
    return this.length;
}
/**
 * 手写map
 * @param {Function} fn 
 */
Array.prototype._map = function(fn) {
    if (typeof fn !== 'function') {
        throw TypeError('fn must be function')
    }
    let res = []
    for (let index = 0; index < this.length; index++) {
        res.push(fn.call(this, this[index], index))
    }
    return res
}
/**
 * 手写filter
 * @param {Function} fn 
 */
Array.prototype._filter = function(fn) {
    if (typeof fn !== "function") {
        throw Error('参数必须是一个函数');
    }
    const res = [];
    for (let i = 0, len = this.length; i < len; i++) {
        fn(this[i]) && res.push(this[i]);
    }
    return res;
}
```
