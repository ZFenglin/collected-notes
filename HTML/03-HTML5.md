# HTML5

[HTML5-思维导图](./mind/03-HTML5.html)

## 语义化标签

01. header：定义文档的页眉（头部）
02. nav：定义导航链接的部分
03. footer：定义文档或节的页脚（底部）
04. article：定义文章内容
05. section：定义文档中的节（section、区段）
06. aside：定义其所处内容之外的内容（侧边）

## 媒体标签

### audio

```html
<audio src='' controls autoplay loop='true'></audio>
```

### video

```html
<video src='' poster='imgs/aa.jpg' controls></video>
```

### source

```html
<video>
    <source src='aa.flv' type='video/flv'>
    </source>
    <source src='aa.mp4' type='video/mp4'>
    </source>
</video>
```

## 表单

### 表单类型

01. email：能够验证当前输入的邮箱地址是否合法
02. url：验证 URL
03. number：只能输入数字，其他输入不了，而且自带上下增大减小箭头，max 属性可以设置为最大值，min 可以设置为最小值，value 为默认值。
04. search：输入框后面会给提供一个小叉，可以删除输入的内容，更加人性化。
05. range：可以提供给一个范围，其中可以设置 max 和 min 以及 value，其中 value 属性可以设置为默认值
06. color：提供了一个颜色拾取器
07. time：时分秒
08. date：日期选择年月日
09. datetime：时间和日期(目前只有 Safari 支持)
10. datetime-local：日期时间控件
11. week：周控件
12. month：月控件

### 表单属性

01. placeholder：提示信息
02. autofocus：自动获取焦点
03. autocomplete="on/off"：使用这个属性需要有两个前提：表单必须提交过，必须有 name 属性
04. required：要求输入框不能为空，必须有值才能够提交。
05. pattern=""：里面写入想要的正则模式，例如手机号 patte="^(+86)?\d{10}$"
06. multiple：可以选择多个文件或者多个邮箱
07. form="form 表单的 ID"

### 表单事件

01. oninput：每当 input 里的输入框内容发生变化都会触发此事件
02. oninvalid 当验证不通过时触发此事件

## DOM查询操作

01. document.querySelector()
02. document.querySelectorAll()

## 进度条和度量器（IE、Safari 不支持）

### progress标签

表示任务进度的标签
01. max：总体任务进度
02. value：完成进度

### meter标签

表示剩余容量或者库存
01. high/low：高/低范围
02. max/min：最大/最小值
03. value：当前度量值

## 拖放

拖放是一种常见的特性，即抓取对象以后拖到另一个位置

```html
<img draggable="true">
```

### 被拖放元素API

01. dragstart
02. darg
03. dragend

### 目标元素API

01. dragenter
02. dragover
03. dragleave
04. drop

## Canvas与SVG

### Canvas

01. 画布，通过Javascript来绘制2D图形
02. 逐像素进行渲染的，位置变化则重新绘制图形

#### Canvas特点

01. 依赖分辨率
02. 不支持事件处理器
03. 弱的文本渲染能力
04. 能够以 .png 或 .jpg 格式保存结果图像
05. 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

### SVG

01. 可缩放矢量图形（Scalable Vector Graphics）是基于可扩展标记语言XML描述的2D图形的语言
02. SVG属性发生变化就会重现图形，至于XML说明SVG DOM中的元素是可用的

#### SVG特点

01. 不依赖分辨率
02. 支持事件处理器
03. 最适合带有大型渲染区域的应用程序（比如谷歌地图）
04. 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
05. 不适合游戏应用

## 地理定位

Geolocation（地理定位）用于定位用户的位置

```js
navigator.geolocation.getCurrentPosition(showPosition)
```

## Web-API

### history

01. go
02. forward
03. back
04. pushstate

## Web存储

01. 新增sessionStorage和localStorage存储方式
02. [详见浏览器原理/本地存储](../浏览器原理/09-本地存储.md)

## 离线存储

01. 可以在离线状态下访问应用数据的存储
02. [详见离线存储](./04-离线存储.md)

## websocket

01. 使用TCP的全双工通信
02. [详见计算机网络/WebSocket](../计算机网络/06-WebSocket.md)

## Web worker

01. 开辟新线程处理JS的接口
02. [详见浏览器原理/进程与线程](../浏览器原理/02-进程和线程.md)
