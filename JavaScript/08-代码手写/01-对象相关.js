/**
 * 对象拷贝支持深浅拷贝
 * @param {*} obj 
 * @param {*} deep 
 * @returns 
 */
function objectCopy(obj, deep = false) {
    if (typeof obj !== 'object') return obj
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let element = obj[key]
            newObj[key] = deep && typeof element === 'object' ? objectCopy(element, deep) : element
        }
    }
    return newObj
}