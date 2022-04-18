# entry

[entry-思维导图](./mind/02-entry.html)

entry 表示入口

## entry特点

1. entry 是配置模块的入口，可抽象成输入
2. entry是必填的

## entry类型

类型可以是string，object，array

```js
module.exports = {
    // string
    // 只有一个入口，入口只有一个文件
    entry: './app/entry',

    // array
    // 只有一个入口，入口有两个文件
    // 搭配output.library使用时，只有最后一个会被导出
    entry: ['./app/entry1', './app/entry1'],

    // object
    // 有两个入口
    entry: {
        a: './app/entry-a',
        b: ['./app/entry-b1', './app/entry-b2'],
    },
}
```

### entry对应的chunk名称

1. string和array：生成一个chunk，名称为main
2. object：可能生成多个chunk，名称为key值
