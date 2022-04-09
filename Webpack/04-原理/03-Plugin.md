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

### 事件流监听和广播

事件流应用了观察者模式，Compiler和Compilation都继承自Tapable，可以直接监听和广播

```JS
// 广播事件
compiler.apply('event-name', params)
// 监听事件
compiler.plugin('event-name', function(params) {})
```

## 插件常用API

### 读取资源，代码块，模块和依赖

```JS
// 遍历可以获取chunk（代码块）
compilation.chunks // chunk

// 遍历可以获取module（代码块的每个模块）
chunk.forEachModule // module

// 当前模块所依赖文件路径
module.fileDependencies
```

### 监听文件变化

```JS
// 发生变化的文件列表
compilation.compiler.watchFileSystem.watcher.mtimes

// 监听文件列表
compilation.fileDependencies
```

### 修改输出资源

```JS
// 输出资源
compilation.assets
```
