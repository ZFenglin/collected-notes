/////
///// 请求封装
///// 
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

    return new Promise(function (resolve, reject) {
        // 创建实例
        let xhr = new XMLHttpRequest()
        // 连接接口
        xhr.open(method, url, true)
        // 注册监听事件
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return
            }
            if (xhr.status === 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.statusText)
            }
        }
        xhr.onerror = function () {
            console.log('onerror' + xhr.statusText)
        }
        xhr.responseType = "json";
        xhr.setRequestHeader("Accept", "application/json");
        // 发送数据
        xhr.send(params)
    })
}


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



/////
///// 数据监听
///// 
/**
 * Proxy监听
 * @param {*} obj 
 * @param {*} setBind 
 * @param {*} getLogger 
 * @returns 
 */
let onWatch = (obj, setBind, getLogger) => {
    let handler = {
        get(target, property, receiver) {
            getLogger(target, property)
            return Reflect.get(target, property, receiver)
        },
        set(target, property, value, receiver) {
            setBind(value, property)
            return Reflect.set(target, property, value)
        }
    }
    return new Proxy(obj, handler)
}
/**
 * Object.defineProperty双向绑定
 * @param {*} obj 
 * @param {*} setBind 
 * @param {*} getLogger 
 * @returns 
 */
Object.defineProperty(obj, 'text', {
    configurable: true,
    enumerable: true,
    get() {
        console.log('获取数据了')
    },
    set(newVal) {
        console.log('数据更新了')
        input.value = newVal
        span.innerHTML = newVal
    }
})
input.addEventListener('keyup', function (e) {
    obj.text = e.target.value
})



/////
///// 其它方面
/////
/**
 * jsonp实现
 * @param {*} src 
 */
function addScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.type = "text/javascript";
    document.body.appendChild(script);
}
addScript("http://xxx.xxx.com/xxx.js?callback=handleRes");
// 设置一个全局的callback函数来接收回调结果
function handleRes(res) {
    console.log(res);
}


/**
 * 图片异步加载
 * @param {String} url 
 */
let imageAsync = (url) => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        img.οnlοad = () => {
            console.log(`图片请求成功，此处进行通用操作`);
            resolve(image);
        }
        img.οnerrοr = (err) => {
            console.log(`失败，此处进行失败的通用操作`);
            reject(err);
        }
    })
}


/**
 * 发布订阅模式
 */
class EventCenter {
    // 1. 定义事件容器，用来装事件数组
    handlers = {}
    // 2. 添加事件方法，参数：事件名 事件方法
    addEventListener(type, handler) {
        // 创建新数组容器
        if (!this.handlers[type]) {
            this.handlers[type] = []
        }
        // 存入事件
        this.handlers[type].push(handler)
    }

    // 3. 触发事件，参数：事件名 事件参数
    dispatchEvent(type, params) {
        // 若没有注册该事件则抛出错误
        if (!this.handlers[type]) {
            return new Error('该事件未注册')
        }
        // 触发事件
        this.handlers[type].forEach(handler => {
            handler(...params)
        })
    }

    // 4. 事件移除，参数：事件名 要删除事件，若无第二个参数则删除该事件的订阅和发布
    removeEventListener(type, handler) {
        if (!this.handlers[type]) {
            return new Error('事件无效')
        }
        if (!handler) {
            // 移除事件
            delete this.handlers[type]
        } else {
            const index = this.handlers[type].findIndex(el => el === handler)
            if (index === -1) {
                return new Error('无该绑定事件')
            }
            // 移除事件
            this.handlers[type].splice(index, 1)
            if (this.handlers[type].length === 0) {
                delete this.handlers[type]
            }
        }
    }
}


/**
 * 简单路由
 */
class Route {
    constructor() {
        // 路由存储对象
        this.routes = {}
        // 当前hash
        this.currentHash = ''
        // 绑定this，避免监听时this指向改变
        this.freshRoute = this.freshRoute.bind(this)
        // 监听
        window.addEventListener('load', this.freshRoute, false)
        window.addEventListener('hashchange', this.freshRoute, false)
    }
    // 存储
    storeRoute(path, cb) {
        this.routes[path] = cb || function () { }
    }
    // 更新
    freshRoute() {
        this.currentHash = location.hash.slice(1) || '/'
        this.routes[this.currentHash]()
    }
}