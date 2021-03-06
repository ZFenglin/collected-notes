# Plugin

## loader和plugin的区别

1. 作用不同
    1. Loader的作⽤是让webpack拥有了加载和解析⾮JavaScript⽂件的能⼒
    2. Plugin 可以监听Webpack构建流程的事件，在合适的时机通过 Webpack 提供的 API 改变输出结果

2. 用法不同
    1. Loader在module.rules中配置，作为模块解析的规则存在
    2. 每个Plugin在plugins中创建实例并单独配置

## Plugin的基本结构

```js
class XxxPlugin {
   constructor(options){} // 构造函数中获取用户传入的配置
    apply(compiler){
        compiler.plugin('事件名称', (compilation,callback)=>{})
    }
}
```

### apply

1. apply方法用于为插件实例传入compiler对象
2. 得到compiler对象后
   1. compiler.plugin('事件名称', 回调函数)监听广播事件
   2. 操作Webpack，改变输出结果

#### compiler.plugin的回调函数的回调参数

1. compilation
2. callback（插件执行完需要执行，否则流程将卡在这里）

## 插件常用API

### 事件流监听和广播

1. 事件流应用了观察者模式
2. Compiler和Compilation都继承自Tapable，可以直接监听和广播

```js
// 广播事件
compiler.apply('event-name', params)
// 监听事件
compiler.plugin('event-name', function(params) {})
```

### 读取资源，代码块，模块和依赖

```js
// 遍历可以获取chunk（代码块）
compilation.chunks // chunk

// 遍历可以获取module（代码块的每个模块）
chunk.forEachModule // module

// 当前模块所依赖文件路径
module.fileDependencies
```

### 监听文件变化

```js
// 发生变化的文件列表
compilation.compiler.watchFileSystem.watcher.mtimes

// 监听文件列表
compilation.fileDependencies
```

### 修改输出资源

```js
// 输出资源
compilation.assets
```

## 简单实现

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
