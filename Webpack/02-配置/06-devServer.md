# devServer

DevServer相关的配置

## 整体配置

```js
module.exports = {
    devServer: {
        proxy: {},
        host: '0.0.0.0',
        static: false,
        headers: {},
        proxy: {},
        before(app, server) {}
        after() {}
        // 热替换（详见优化/开发体验文档）
        hot: true,
        hotOnly: true
        // 配置DevServer HTTP服务器的文件根目录
        contentBase: path.join(__dirname, 'public'),
        // 是否开启Gzip压缩
        compress: true,
        // 是否开发html5 history api网页
        historyApiFallback: true,
        // 是否开启https模式
        https: false,
        // 自动打开浏览器
        open: true,
    },
}
```

## port：服务监听端口

```js
module.exports = {
    devServer: {
        port: 8080, // 默认
    },
}
```

## host：配置服务监听地址

```js
module.exports = {
    devServer: {
        host: '0.0.0.0',
    },
}
```

也可以命令行使用

```bash
npx webpack serve --host 0.0.0.0
```

## static：配置从目录提供静态文件的选项

```js
// 默认是 'public' 文件夹
module.exports = {
    devServer: {
        // 禁用
        static: false,
        // 监听单个目录
        static: ['assets'],
        //监听多个资源
        static: ['assets', 'css'],
    },
}
```

也可以命令行使用

```bash
# 启用
npx webpack serve --static
# 禁用
npx webpack serve --no-static
# 设置目录
npx webpack serve --static assets --static css
```

## headers：注入响应头

```js
module.exports = {
    //...
    devServer: {
        // 利用对象
        headers: {
            'X-Custom-Foo': 'bar',
        },
        // 利用数组
        headers: [{
            key: 'X-Custom',
            value: 'foo',
        }],
    },
}
```

## proxy：代理接口（跨域）

```js
module.exports = {
    devServer: {
        // 添加代理解决跨域
        proxy: {
            "/api": {
                target: "http://loaclhost:9092"
            }
        }
    },
};
```

## mock：before和after钩子实现数据模拟

```js
module.exports = {
    devServer: {
        // 利用before钩子解决数据mock，其实是钩入了express服务
        // before是中间件启动前
        before(app, server) {
            app.get('/api/mock', (req, res) => {
                res.json({
                    msg: 'hello'
                })
            });
        }
        // after是中间件启动后
        after() {}
    },
};
```
