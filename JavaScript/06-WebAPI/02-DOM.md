# [DOM](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)

## 概念

1. Document Object Model(DOM)
2. HTML和XML文档的编程接口

### 与HTML区别

1. XML是一直可扩展的标记语言，HTML就是提前设置好标签规范的XML
2. DOM是浏览器解析HTML文档，处理为JS能理解的节点对象树形式

## 操作方式

### 节点获取

```js
// id选择器
document.getElementsByTagName('div')
// 类选择器
document.getElementsByClassName('container')
// 元素选择器
document.querySelectorAll('p')
// 父节点获取
div.parentNode
// 孩子节点获取
// 中间文本元素也存在，通过filter过滤nodeType不为1的
div.childNodes
```

### 节点增删

```js
// 创建元素
document.createElemnt('p')
// 创建文档片段
document.createDocumentFragment()
// 插入或者移动子节点
div.appendChild(p)
// 删除子节点
div.removeChild(child[0])
```

### 节点属性

#### property（节点对象属性）

1. p.style
2. p.className
3. p.nodeName
4. p.nodeType

#### attribute（节点标签属性）

1. p.getAttribute('data-name')
2. p.setAttribute('data-name', 'juejin')

#### property与attribute的区别

1. property是对节点对象的属性进行修改，可能引起重排和重绘
2. attribute是对HTML标签进行修改，会修改HTML文档，必定会触发重排和重绘，频繁使用影响性能

## 性能优化

DOM操作十分占据性能，应减少对DOM树的更改

1. 查询缓存：将DOM查询结果进行缓存供下次使用
2. 多次操作合并：利用createDocumentFragment将多次操作在文档片段上执行，统一将片段插入DOM树中
3. 利用渲染队列机制：元素多次操作放在一起
