# resolve

配置寻找模块的规则

## 整体配置

```js
module.exports = {
    resolve: {
        modules: [],
        extensions: [],
        alias: {},
        mainFields: [],
        descriptionFiles: [],
        // 是否跟随文件的软连接去搜寻模块的路径
        symlinks: true,
        // 是否强制导入语句写明文件后缀
        enforceExtension: false,
    },
}
```

## modules：寻找模块的根目录

```js
module.exports = {
    resolve: {
        // 为array类型，默认以node_modules 为根目录
        modules: [
            'node_modules',
            path.resolve(__dirname, 'app')
        ],
    },
}
```

## extensions：自动补充导入语句的文件后缀

```js
module.exports = {
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css'],
    },
}
```

## alias：模块别名设置

```js
module.exports = {
    resolve: {
        // 对象alias
        alias: {
            // 将'module'映射成'new-module', 同样，'module/path/file'也会被映射成 'new-module/path/file'
            'module': 'new-module',
            'only-module': 'new-module'
        },
        // 数组alias（更详细配置）
        alias: [{
            // 老模块
            name: 'module',
            // 新模块
            alias: 'new-module',
            // 是否只映射模块，如果是true，则只有'module'会被映射；如果是false，则'module/inner/path'也会被映射
            onlyModule: true,
        }],
    },
}
```

## mainFields：模块的描述文件里描述入口的文件的字段名

```js
module.exports = {
    resolve: {
        mainFields: ['browser', 'main'],
    },
}
```

1. 部分模块会针对不同环境提供几份代码
2. mainFields设置使用那种环境代码的优先级（第一个可用的）

## descriptionFiles：配置描述第三方模块的文件名称（package.json名称）

```js
module.exports = {
    resolve: {
        descriptionFiles: ['package.json'],
    },
}
```
