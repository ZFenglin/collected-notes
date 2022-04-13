# WebAPI概述

## [WebAPI](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs)

### API（Application Programming Interface）

它们抽象了复杂的代码，并提供一些简单的接口规则直接使用

### WebAPI与ES差异

1. ES，规定语法并遵循ECMA 262 标准
2. WebAPI，浏览器提供的操作API，遵从W3C标准，ES与其结合才能进行实际应用

### JavaScript组成

#### JavaScript@web

1. ECMAScript
2. BOM
3. DOM

#### JavaScript@node

1. ECMAScript
2. fs
3. net
4. etc

## WebAPI分类

1. BOM
2. DOM
3. AJAX
4. 事件绑定
5. 监听事件
6. 本地存储

### 页面加载事件监听

```js
// load
// 页面全部资源加载完才会执行
window.addEventListener('load', function() {})

// DOM渲染完可执行
// defer属性的JS标签在这之前执行
ducument.addEventListener('DOMContentLoaded', function() {})
```
