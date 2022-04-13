# BOM

Browser Object Model(BOM)，浏览器本身的一些信息的设置和获取的接口，都在window对象上

## screen

屏幕属性

1. screen.width
2. screen.height
3. screen.top

## location

链接到的对象的位置

1. location.href
2. location.protocol
3. location.host
4. location.pathname
5. location.search
6. location.hash

## history

访问历史记录信息

1. history.back()
2. history.forward()
3. history.go(num)

history.go的参数为正往前跳，负数往后跳转

## navigator

用户代理信息

### navigator识别浏览器

#### 识别型号

navigator.userAgent对于不同的浏览器有不同的值

1. chrome浏览器：Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36
2. IE11浏览器：Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; . NET4.0C; . NET4.0E; . NET CLR 2.0.50727; . NET CLR 3.0.30729; . NET CLR 3.5.30729; McAfee; rv:11.0) like Gecko
3. safari 5.1 – MAC：User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50

#### 移动端检测

```JS
// mobile 检测
if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
    browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"]) {
    browser.mobile = true;
}
// pc 检测
if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true;
}
```
