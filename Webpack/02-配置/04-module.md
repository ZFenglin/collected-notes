# module

[module-思维导图](./mind/04-module.html)

配置模块相关

## 整体配置

```js
module.exports = {
    module: {
        rules: [],
        noParse: [],
    },
}
```

## rules

配置lodader

```js
module.exports = {
    module: {
        rules: [{
            // 条件匹配
            // 正则匹配命重要使用Loader的文件
            test: /.jsx?$/,
            // 只会命中这里面的文件
            include: [
                path.resolve(__dirname, 'app')
            ],
            // 忽略这里面的文件
            exclude: [
                path.resolve(__dirname, 'app/demo-files')
            ],

            // 应用loader
            use: [
                // 直接使用loader的名称
                'style-loader',
                {
                    loader: 'css-loader',
                    // 向html-loader传一些参数
                    options: {}
                }
            ]
        }]
    },
}
```

### loader设置方式

1. 条件匹配：通过test、include和exclude配置要应用的规则
2. 应用规则：use设置匹配文件的Loader
3. 执行顺序：默认从右往左（配置enforce可以更改）
   1. post：最后
   2. pre：最前

### parser：更加细粒度地配置那些模块语法被解析

可以精确到语法层面

```js
module.exports = {
    module: {
        rules: [
            test: /\.js/,
            use: ['babel-loader'],
            parser: {
                amd: false, // 禁用 AMD
                commonjs: false, // 禁用 CommonJS
                system: false, // 禁用 SystemJS
                harmony: false, // 禁 ES6 import/export
                requireinclude: false, // 禁用 require.include
                requireEnsure: false, // 禁用 require ens ur
                requireContext: false, // 禁 require.context
                browserify: false, // 禁 browserify
                requireJs: false, //禁用 requirejs
            }
        ]
    }
}
```

## noParse：用于忽略部分没有采用模块化的文件的递归解析和处理

提高构建性能

```js
// 配置模块相关
module.exports = {
    module: {
        // 不用解析和处理的模块
        noParse: [
            //用正则匹配
            /special-library.js$/
        ],
    },
}
```

### 参数配置

1. 正则
2. 正则数组
3. 函数
