# HTML标签

[HTML标签-思维导图](./mind/02-HTML标签.html)

## DOCTYPE(⽂档类型宣告)

一种标准通用标记语言的文档类型声明

```html
<!-- 必须声明在HTML⽂档的第⼀⾏ -->
<!doctype html>
```

### DOCTYPE作用

1. 告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档
2. 不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析

#### 解析模式（document.compatMode获取）

##### CSS1Compat：标准模式（Strick mode）（默认）

1. 使用W3C的标准解析渲染页面
2. 浏览器以其支持的最高标准呈现页面

##### BackCompat：怪异模式(混杂模式)(Quick mode)

1. 浏览器使用自己的怪异模式解析渲染页面
2. 页面以一种比较宽松的向后兼容的方式显示（防止老站点无法使用）

## head标签

标签用于定义文档的头部，所有头部元素的容器

### head作用

1. title标签定义文档的标题（唯一必须）
2. 引用脚本和样式表
3. head中内容不会作为显示内容
4. meta标签提供元信息

### meta标签

提供了HTML 文档的元数据，用来描述一个HTML网页文档的属性

元数据不会显示在客户端，但是会被浏览器解析

#### 常见meta标签

##### charset（编码类型）

```html
<meta charset="UTF-8">
```

##### keywords（页面关键词）

```html
<meta name="keywords" content="关键词" />
```

##### description（页面描述）

```html
<meta name="description" content="页面描述内容" />
```

##### refresh（页面重定向和刷新）

```html
<meta http-equiv="refresh" content="0; url=" />
```

##### viewport（控制视口的大小和比例）

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

###### content 参数

1. width viewport ：宽度(数值/device-width)
2. height viewport ：高度(数值/device-height)
3. initial-scale ：初始缩放比例
4. maximum-scale ：最大缩放比例
5. minimum-scale ：最小缩放比例
6. user-scalable ：是否允许用户缩放(yes/no）

##### 搜索引擎索引方式

```html
<meta name="robots" content="index, follow" />
```

content 参数有以下几种：

1. all：文件将被检索，且页面上的链接可以被查询
2. none：文件将不被检索，且页面上的链接不可以被查询
3. index：文件将被检索
4. follow：页面上的链接可以被查询
5. noindex：文件将不被检索
6. nofollow：页面上的链接不可以被查询

## script标签

1. 默认情况下：立即加载并执行脚本，会阻塞页面加载
2. 异步加载外部的JS脚本文件，不会阻塞页面的解析

### script标签异步加载

![script标签加载流](assets/02-script标签加载流.png)

#### defer

1. 下载完成后仍然等待文档解析
2. 解析完后在DOMContentLoaded前依次执行，按照加载顺序执行

#### async

1. 下载完成后立即解析
2. 不会按照加载顺序执行

## img标签

### [图片自适应(srcset)](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

给图片设置srcset和sizes实现图片自适应

#### srcset（指定图片的地址和对应的图片质量）

```html
<!-- 实现在屏幕密度为 1x 的情况下加载 image-128.png, 屏幕密度为 2x 时加载 image-256.png -->
<img src="image-128.png" srcset="image-256.png 2x" />
```

#### sizes（用来设置图片的尺寸临界点）

```html
<img src="image-128.png" srcset="image-128.png 128w, image-256.png 256w, image-512.png 512w" sizes="(max-width: 360px) 340px, 128px" />
```

1. srcset 中的 w 单位，可以理解成图片质量
2. 如果可视区域小于这个质量的值，就可以使用。浏览器会自动选择一个最小的可用图片

使用语法如下

```
sizes="[media query] [length], [media query] [length] ... "
```

## iframe标签

嵌套的browsing context，将另一个HTML页面嵌入到当前页面中

### iframe标签优缺点

#### 优点

1. 用来加载速度较慢的内容（如广告）
2. 并行下载脚本
3. 可以实现跨子域通信

#### 缺点

1. 会阻塞主页面的onload事件
2. 无法被一些搜索引擎索识别
3. 会产生很多页面，不易管理

## label标签

用户界面中某个元素的说明

选中label标签时，会自动将焦点转到和label标签相关的表单控件上

```html
<!-- 方法一 -->
<label for="mobile">Number:</label>
<input type="text" id="mobile" />

<!-- 方法二 -->
<label>Date:<input type="text" /></label>
```
