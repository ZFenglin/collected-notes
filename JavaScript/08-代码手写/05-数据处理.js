/**
 * 日期格式化
 * @param {Date} dateInput 
 * @param {String} format 
 */
const dateFormat = (dateInput, format) => {
    // 获取年月日
    let year = dateInput.getFullYear()
    let month = dateInput.getMonth() + 1
    let day = dateInput.getDate()
    // 通过replace正则替换 
    format = format.replace('yyyy', year)
    format = format.replace('MM', month)
    format = format.replace('dd', day)
    return format
}


/**
 * 转化千分位
 * @param {Number} number 
 */
function _priceFormat(number) {
    function addPoint(str) {
        let arr = str.split('')
        let len = 0
        let res = ''
        for (let index = 0; index < arr.length; index++) {
            len++
            res += arr[index];
            if (len == 3 && index != arr.length - 1) {
                res += ','
                len = 0
            }
        }
        for (let index = 0; index < arr.length; index++) {
            len++
            res += arr[index];
            if (len == 3 && index != arr.length - 1) {
                res += ','
                len = 0
            }
        }
        return res
    }
    let str = number.toString()
    let arr = str.split('.')
    if (arr.length > 1) {
        return _reverse(addPoint(_reverse(arr[0]))) + '.' + addPoint(arr[1])
    } else {
        return _reverse(addPoint(_reverse(arr[0])))
    }
}


/**
 * 大正整数相加
 * @param {String} a 
 * @param {String} b 
 */
function sumBigNumber(a, b) {
    let res = '';
    let temp = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || temp) {
        temp += ~~a.pop() + ~~b.pop();
        res = (temp % 10) + res;
        temp = temp > 9
    }
    return res.replace(/^0+/, '');
}


/**
 * 对象转化为树
 * @param {Array} data 
 */
function jsonToTree(data) {
    // 初始化结果数组，并判断输入数据的格式
    let result = []
    if (!Array.isArray(data)) {
        return result
    }
    // 使用map，将当前对象的id与当前对象对应存储起来
    let map = {};
    data.forEach(item => {
        map[item.id] = item;
    });
    data.forEach(item => {
        let parent = map[item.pid];
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    });
    return result;
}


/**
 * 解析params
 * @param {String} url 
 */
function parseParam(url) {
    const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
    const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
    let paramsObj = {};
    // 将 params 存到对象中
    paramsArr.forEach(param => {
        if (/=/.test(param)) { // 处理有 value 的参数
            let [key, val] = param.split('='); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
            if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], val);
            } else { // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = val;
            }
        } else { // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    })
    return paramsObj;
}


/**
 * 查找文章中出现频率最高的单词
 * @param {*} article 
 * @returns 
 */
function findMostWord(article) {
    // 合法性判断
    if (!article) return;
    // 参数处理
    article = article.trim().toLowerCase();
    let wordList = article.match(/[a-z]+/g),
        visited = [],
        maxNum = 0,
        maxWord = "";
    article = " " + wordList.join("  ") + " ";
    // 遍历判断单词出现次数
    wordList.forEach(function (item) {
        if (visited.indexOf(item) < 0) {
            // 加入 visited 
            visited.push(item);
            let word = new RegExp(" " + item + " ", "g"),
                num = article.match(word).length;
            if (num > maxNum) {
                maxNum = num;
                maxWord = item;
            }
        }
    });
    return maxWord + "  " + maxNum;
}
