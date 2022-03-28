# [AJAX](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data#xmlhttprequest)

Asynchronous JavaScript and XML，即异步的JS和XML

不重新加载整个页面的情况下，与服务器交换数据并更新部分网页内容

## [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

### Promise封装XHR

```JS
/**
 * Promise封装AJAX
 * @param {String} url 
 * @param {String} method 
 * @param {any} params 
 */
function fetchUrl(url, method, params) {
    if (!url || typeof url !== 'string') throw TypeError('url must be string')
    let methods = ['get', 'put', 'post']
    if (!methods.includes(method)) throw TypeError(`method must in ${methods.toString()}`)

    return new Promise(function(resolve, reject) {
        // 创建实例
        let xhr = new XMLHttpRequest()
        // 连接接口
        xhr.open(method, url, true)
        // 注册监听事件
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) {
                return
            }
            if (xhr.status === 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.statusText)
            }
        }
        xhr.onerror = function() {
            console.log('onerror' + xhr.statusText)
        }
        xhr.responseType = "json";
        xhr.setRequestHeader("Accept", "application/json");
        // 发送数据
        xhr.send(params)
    })
}
```

### xhr.open的参数

必填

1. method（HTTP方法）
2. url（发送请求的URL）

可选

1. async（是否异步执行操作，默认为true）
2. user（可选用户名）
3. password（可选的密码）

### xhr.send参数支持格式

1. ArrayBuffer
2. ArrayBufferView
3. Blob
4. Document
5. DOMString
6. FormData

### 实例状态

#### xhr.readyState

请求过程状态
1. 0（代理被创建，但尚未调用open()方法）
2. 1（open()方法已经被调用）
3. 2（send()方法已经被调用，并且头部和状态已经可获得）
4. 3（下载中）
5. 4（下载操作已完成）

#### xhr.status

响应中的数字状态码

## [Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

一种替代XMLHttpRequest更简单的API

fetch()返回一个Promise对象

响应状态码的异常不会导致reject，需要在then中手动处理

### Fetch参数

1. input（获取资源的 URL或者Request对象）
2. init（请求的设置，请求方式，请求数据等）

### Fetch封装类

```JS
/**
 * fetch封装类
 */
class HttpRequestUtil {
    async get(url) {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }
    async post(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        return result;
    }
    async put(url, data) {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        });
        const result = await res.json();
        return result;
    }
    async delete(url, data) {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        });
        const result = await res.json();
        return result;
    }
}
```