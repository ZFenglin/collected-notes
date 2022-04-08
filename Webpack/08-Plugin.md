# Plugin

## Plugin概念

Plugin更加灵活，适用于各种场景

Plugin监听Webpack运行周期中所广播的事件，利用Webpack提供的API进行改变输出结果

### loader和plugin的区别

1. loader 用于webpack解析非js文件，比如css，图片等的能力
2. plugin 用于拓展webpack的能力，比如htmlWebpackPlugin，可以在其生命周期中监听事件更改构建结果

## Plugin的基本结构

### constructor

构造函数中获取用户传入的配置

### apply

apply方法用于为插件实例传入compiler对象

得到compiler对象后
1. 可以通过compiler.plugin('事件名称', 回调函数)监听广播事件
2. 也可以操作Webpack

compiler.plugin的回调函数的回调参数
1. compilation
2. callback（插件执行完需要执行，否则流程将卡在这里）

### 简单实现

```js
moudle.exports = class DonePlugin {
    apply(compiler) {
        // 注册完成钩子
        compiler.hooks.done.tap('DonePlugin', () => {
            console.log('打包完成');
        })
    }
}

moudle.exports = class RunPlugin {
    apply(compiler) {
        // 注册开始钩子
        compiler.hooks.run.tap('RunPlugin', () => {
            console.log('开始打包');
        })
    }
}
```
