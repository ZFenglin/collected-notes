# SSR处理

## 客户端入口修改

### 路由修改

1. 修改为执行一次创建一个Router实例

```js
import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
const routes: RouteRecordRaw[] = [
  // ...
]
export function createRouter () {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: routes,
  })
  return router
}
```

### main.ts

1. 使用createSSRApp
2. 引入路由并执行创建

```js
import { createSSRApp } from 'vue'
import App from './App.vue'
// 引入vue-router
import { createRouter } from './router'

export const createApp = () => {
  const router = createRouter()
  const app = createSSRApp(App)
  app.use(router)
  return { app, router }
}

```

### entry-client.ts

```ts
import { createApp } from './main'
const { app, router } = createApp()
router.isReady().then(() => {
  app.mount('#app')
})
```

### entry-server.ts

```js
import { createApp } from './main'
import { renderToString } from 'vue/server-renderer'
import type { RouteLocationRaw } from 'vue-router'

export async function render (url: RouteLocationRaw) {
  const { app, router } = createApp()
  router.push(url)
  await router.isReady()
  const ctx = {}
  const html = await renderToString(app, ctx)
  return [html]
}
```

## 创建开发服务器

### npm安装

1. express
2. serve-static
3. compression

### index.html文件修改

1. 大多数文章都说增加`<!--app-->` ，用于替换，但是我测试了下会出现两个页面

### 服务器启动代码

#### 开发环境启动server-dev.js

```js
const fs = require('fs')
const path = require('path')
const express = require('express')

async function createServer (root = process.cwd()) {
  const resolve = (p) => path.resolve(__dirname, p)
  const app = express()

  const vite = await require('vite').createServer({
    root,
    logLevel: 'info',
    server: {
      middlewareMode: 'ssr',
      watch: {
        usePolling: true,
        interval: 100
      }
    }
  })
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template = fs.readFileSync(resolve('index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      const render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
      const [appHtml] = await render(url)
      const html = template
        .replace('<div id="app"></div>', `<div id=app data-server-rendered="true">${appHtml}</div>`)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) =>
  app.listen(4000, () => {
    console.log('http://localhost:4000')
  })
)
```

#### 正式环境启动server-prod.js

```js
const fs = require('fs')
const path = require('path')
const express = require('express')

async function createServer () {
  const resolve = (p) => path.resolve(__dirname, p)
  const indexProd = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
  const app = express()

  app.use(require('compression')())
  app.use(
    require('serve-static')(resolve('dist/client'), {
      index: false
    })
  )

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      const template = indexProd
      const render = require('./dist/server/entry-server.js').render
      const [appHtml] = await render(url)
      const html = template
        .replace('<div id="app"></div>', `<div id=app data-server-rendered="true">${appHtml}</div>`)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })
  return { app }
}

createServer().then(({ app }) =>
  app.listen(4000, () => {
    console.log('http://localhost:4000')
  })
)
```
