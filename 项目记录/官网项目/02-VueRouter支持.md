# VueRouter支持

```BASH

## 安装

npm install vue-router@4
```

## 路由配置

配置路由记得RouteRecordRaw的类型设置

```TS
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/app-layout.vue'
import NotFoundLayout from '@/layout/not-found-layout.vue'
import homeRoutes from './modules/home'
import algorithmsRoutes from './modules/algorithms'
import solutionsRoutes from './modules/solutions'
import aboutRoutes from './modules/about'
import newsRoutes from './modules/news'
import joinRoutes from './modules/join'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
    component: AppLayout,
    children: [
        homeRoutes,
      algorithmsRoutes,
      solutionsRoutes,
      aboutRoutes,
      newsRoutes,
      joinRoutes
    ]
  },
  // 404页面匹配
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundLayout
  }
]

const router = createRouter({
    history: createWebHashHistory(), // 路由模式
  routes: routes
})
export default router
```

这是将路由拆分成多个文件，方便后续维护和开发

```TS
import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw =
  {
    path: 'algorithms',
    name: 'algorithms',
    component: RouterView,
    meta: {
      title: 'AI算法'
    },
    children: [
      {
        path: 'detail/:id',
        name: 'algorithms-detail',
        component: () => import('@/views/algorithms/algorithms-index.vue'),
        meta: {
          title: 'AI算法详情'
        }
      }
    ]
  }

export default routes
```
