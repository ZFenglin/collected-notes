# Babel

## Babel概念

将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法

### Babel作用

1. 语法转换
2. Polyfill方式在目标环境中添加缺失的特性
3. 源码转换

### Babel环境搭建

安装以下依赖包
1. @babel/core
2. @babel/cli
3. @babel/preset-env

.babelrc配置babel，预设(presets) 和 插件(plugins)

```JS
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": true,
                "useBuiltIns": "usage", // Polyfill按需架子啊
                "targets": {
                    "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                }
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime", // 防止全局被污染
        ]
    ],
}
```

## 预设和插件

预设(presets) 和 插件(plugins)都是babel插件引入方式

1. babel通过plugins进行转化处理
2. preset（预设）则是一组plugins和配置的共享模块

### 官方提供的预设

1. @babel/preset-env：ES2015+ syntax
2. @babel/preset-typescript：TypeScript
3. @babel/preset-react：React
4. @babel/preset-flow：Flow

## Polyfill

作为一个处理JS的补丁，用于处理一些不支持的方法

### Polyfill组成

Babel 7.4.0 版本开始，这个软件包已经不建议使用，建议直接使用core.js和regenerate

#### core.js

1. 一个集成了ES6新的JS的补丁polyfill
2. 不支持生成器和异步操作

#### regenerator

1. generator已经被放弃，改用async/await
2. regenerator用于支持generator

### Polyfill使用方式

#### Polyfill安装

```BASH
npm install @babel/polyfill --save
```

#### Polyfill使用

```JS
// 应用入口顶部通过 require 将 polyfill 引入进来
require("babel-polyfill");
// 应用入口使用 ES6 的 import 语法，你需要在入口顶部通过 import 将 polyfill 引入，以确保它能够最先加载
import "babel-polyfill";
```

#### Polyfill按需加载

preset-env 提供了一个 "useBuiltIns" 参数，设置为usage则只会包含所使用的polyfill

#### runtime

直接使用core.js或polyfill则会污染全局系统，runtime则会对内置组件进行别名处理，防止污染

安装

```BASH
npm install --save @babel/runtime
npm install --save-dev @babel/plugin-transform-runtime
```

## 转义过程

![Babel解析流程](assets/06-Babel解析流程.png)

### 解析 Parse

将代码解析⽣成抽象语法树（AST），词法分析与语法分析的过程

### 转换 Transform

babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，此过程中进⾏添加、更新及移除等操作

### ⽣成 Generate

变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator
