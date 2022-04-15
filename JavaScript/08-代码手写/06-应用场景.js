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