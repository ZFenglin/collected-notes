# [Symbol](https://www.zhangxinxu.com/wordpress/2018/04/known-es6-symbol-function/)

1. symbol 是一种基本数据类型
2. Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法

## 作用

1. 表示一个独一无二的值
2. 适合作为对象属性

## 使用

### 特点

1. 不能使用new命令
2. 参数相同的Symbol是不同的
3. 作为对象属性，获取不能用.，而是[]

### 属性获取

1. 可获取
   1. Object.getOwnPropertySymbols()
2. 不可获取
   1. for...in，for...of遍历
   2. Object.keys()
   3. Object.getOwnPropertyNames()
   4. JSON.stringify()会忽略

## 内置Symbol常量

1. Symbol.toStringTag
2. Symbol.iterator

## 相关方法

1. getOwnPropertySymbols：获取对象Symbol
2. Symbol.for：获取全局的对应的标识符的Symbol
