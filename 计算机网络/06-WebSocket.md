# [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

WebSocket是 HTML5 定义的一个新的网络传输协议，可在单个TCP连接上进行全双工通信，位于OSI模型的应用层

## 使用

```js
// 创建连接实例
const socket = new WebSocket('ws://localhost:8080');

// 连接监听
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// 关闭监听
socket.addEventListener('close', function (event) {
     socket.send('Bey Server!');
})

// 服务端消息监听
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
})

// 发送消息
socket.send("Hello WebSockets!");
```

## 即时通讯

### 短轮询

浏览器每隔一段时间向浏览器发送 http 请求，服务器端在收到请求后，不论是否有数据更新，都直接进行响应

### 长轮询

首先由客户端向服务器发起请求，当服务器收到客户端发来的请求后，服务器端不会直接进行响应，而是先将这个请求挂起，然后判断服务器端数据是否有更新

如果有更新，则进行响应，如果一直没有数据，则到达一定的时间限制才返回

### SSE

服务器使用流信息向服务器推送信息

### WebSocket 

该协议允许由服务器主动的向客户端推送信息

### 比较

前三个都是基于HTTP协议的

性能：WebSocket > 长连接（SEE） > 长轮询 > 短轮询

兼容性： 短轮询 > 长轮询 > 长连接（SEE） > WebSocket