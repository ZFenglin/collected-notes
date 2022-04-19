# [Symbol](https://www.zhangxinxu.com/wordpress/2018/04/known-es6-symbol-function/)
1. symbol 是一种基本数据类型
2. Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法

## 作用

1. 表示一个独一无二的值
2. 适合作为对象私有属性

## 使用

### 特点

1. 不能使用new命令
2. 参数相同的Symbol是不同的

### 多作为属性名限制

1. 只能为公有属性
2. 获取不能用.，而是[]

### 属性获取

1. 可以被Object.getOwnPropertySymbols()获取
2. 不能被for...in，for...of遍历
3. 不能被Object.keys()或者Object.getOwnPropertyNames()返回
4. JSON.stringify()会忽略

## 内置Symbol常量

1. Symbol.toStringTag
2. Symbol.iterator

## 相关方法

1. getOwnPropertySymbols：获取对象Symbol
2. Symbol.for：获取全局的对应的标识符的Symbol
