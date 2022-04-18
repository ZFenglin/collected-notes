# Symbol

[Symbol-思维导图](./mind/07-Symbol.html)

1. symbol 是一种基本数据类型
2. Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法

## 作用

所有的Symbol都是不同的，即使传入的标识符相同

1. 表示一个独一无二的值
2. 适合作为对象私有属性

## 内置Symbol常量

1. Symbol.toStringTag
2. Symbol.iterator

## 相关方法

1. getOwnPropertySymbols：获取对象Symbol
2. Symbol.for：获取全局的对应的标识符的Symbol
