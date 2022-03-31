# [SVG加载插件](https://juejin.cn/post/7051456476384559111#heading-5)

## 注意

vite的插件只能在src外部才能使用node的fs，path等模块

以下的在src中的文件应当放到根目录来处理

## 配置TSnode支持

不配置则插件代码会报fs找不到的错误

```JSON
{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node"
  },
  "include": [
    "vite.config.ts",
    // 增加对应的文件，让其支持node模块使用
    "./src/plugins/svg-loader.ts"
  ]
}
```

## 添加插件代码

/src/plugins/svg-loader.ts

```TS
import { readFileSync, readdirSync } from 'fs'
let idPerfix = ''
const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

function findSvgFile (dir: string):any {
  const svgRes = []
  const dirents = readdirSync(dir, {
    withFileTypes: true
  })
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      svgRes.push(...findSvgFile(dir + dirent.name + '/'))
    } else {
      const svg = readFileSync(dir + dirent.name)
        .toString()
        .replace(clearReturn, '')
        .replace(svgTitle, ($1: any, $2: string) => {
          let width = 0
          let height = 0
          let content = $2.replace(clearHeightWidth, (s1: any, s2: string, s3: number) => {
            if (s2 === 'width') {
              width = s3
            } else if (s2 === 'height') {
              height = s3
            }
            return ''
          })
          if (!hasViewBox.test($2)) {
            content += `viewBox="0 0 ${width} ${height}"`
          }
          return `<symbol id="${idPerfix}-${dirent.name.replace('.svg', '')}" ${content}>`
        })
        .replace('</svg>', '</symbol>')
      svgRes.push(svg)
    }
  }
  return svgRes
}

export const svgLoader = (path: string, perfix = 'icon') => {
  if (path === '') return
  idPerfix = perfix
  const res = findSvgFile(path)

  return {
    name: 'svg-transform',
    transformIndexHtml (html: string) {
      return html.replace(
        '<body>',
          `
          <body>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
              ${res.join('')}
            </svg>
        `
      )
    }
  }
}
```

## vite配置

```JS
import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import {
    ElementPlusResolver
} from 'unplugin-vue-components/resolvers'
import {
    svgLoader
} from './src/plugins/svg-loader'
import * as path from 'path'
export default defineConfig({
    plugins: [
        vue(),
        eslintPlugin({}),
        // svg导入
        svgLoader('./src/assets/svg/')
    ],
    resolve: {
        alias: {
            // '@': '绝对路径'
            '@': path.join(__dirname, './src')
        }
    }
})
```

## 组件添加

```VUE
<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    v-on="$attrs"
    :style="{color: props.color}"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
/**
   * 使用方式：
   * 在 template 中使用 <svg-icon name="bug"/>
   */
import { computed } from 'vue'
interface Props {
name: {
    type: string,
    required: true
},
color: string
}
const props = defineProps<Props>()
const iconName = computed((): string => `#icon-${props.name}`)
const svgClass = computed((): string => {
  if (props.name) {
    return `svg-icon icon-${props.name}`
  } else {
    return 'svg-icon'
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
```
