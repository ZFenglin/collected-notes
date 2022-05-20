# output

如何输出结果，在webpack经过一系列处理后，如何输出最终想要的代码

## 整体配置

```js
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: '[id].js',
        publicPath: 'http://cdn.example.com/assets/',
        library: 'MyLibrary',
        libraryTarget: 'umd',

        // 是否包含有用的文件路径信息到生成的代码里，为boolean类型
        pathinfo: true,
        // jsonp异步加载资源时的毁掉函数名称，需要和服务器搭配使用
        jsonpFunction: 'myWebpackJsonp',
        // 生成的Source Map文件的名称
        sourceMapFilename: '[file].map',
        // 浏览器开发者工具里显示的源码模块名称
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
        // 异步加载跨域的资源时使用的方式
        crossOriginLoading: 'use-credentials',
        crossOriginLoading: 'anonymous',
        crossOriginLoading: false,
    },
}
```

## path：输出文件存放的目录（strig绝对路径）

```js
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
    }
}
```

## filename：配置输出文件名称

```js
module.exports = {
    output: {
        filename: 'bundle.js', // 静态的固定名称
        filename: '[name].js', // 可以通过内置变量设置动态名称
        filename: '[hash:8].js', // hash相关动态名称长度可以指定
    },
}
```

### 文件名称的内置变量

1. id：唯一标识
2. name：chunk名称
3. hash：chunk的唯一标识的Hash值
4. chunkhash：Chunk内容的Hash值

## chunkFilename：没有配置入口的Chunk的输出名称

```js
module.exports = {
    output: {
        chunkFilename: '[id].js',
        chunkFilename: '[chunkhash].js',
    },
}
```

## publicPath：配置发布到线上资源的URL前缀

1. 打包资源增加固定前缀
2. 注意路径问题，不然会404

```js
module.exports = {
    output: {
        publicPath: '/assets/', // 放到指定目录下
        publicPath: '', //放到跟目录下
        publicPath: 'http://cdn.example.com/assets/', // 放倒CDN上
    },
}
```

```html
<!-- 线上的HTML的地址需要改为 -->
<script src='https://cdn.example.com/assets/a_12345678.js'></script>
```

## library：导出库的名称

```js
// 默认的输出格式是匿名的立即执行函数
module.exports = {
    output: {
        library: 'MyLibrary',
    },
}
```

## libraryTarget：导出库的类型

### var（默认）

```js
var LibraryName = lib_code
```

### commonjs

```js
exports['LibraryName'] = lib_code
```

### commonjs2

```js
module.exports = lib_code
```

### this

```js
this['LibraryName'] = lib_code
```

### window

```js
window['LibraryName'] = lib_code
```

### global

```js
global['LibraryName'] = lib_code
```
