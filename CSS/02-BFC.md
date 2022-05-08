# [BFC](https://zhuanlan.zhihu.com/p/25321647)

1. Block Format Context：块级格式化上下文
2. 独立的渲染区域
3. 内部元素按照容器规则进行摆放
4. 内部元素的处理不会影响外部元素，也不会被外部影响
5. BFC与GPU加速开启的图层不相同

## [BFC特性](https://segmentfault.com/a/1190000009545742)

1. 内部元素的处理不会影响外部元素，也不会被外部影响
2. 对内
    1. 内部的Box会在垂直方向自上而下排列
    2. 内部的Box的 margin-left 和BFC容器的 border-left 相接触，除非内部内部的Box具有自己的BFC
    3. 属于同一个BFC的两个相邻Box的垂直margin会发生重叠
3. 对外
    1. BFC的区域不会与float box重叠
    2. 计算BFC高度，浮动元素也会参与计算

## 创建BFC

1. 根元素或其它包含它的元素
2. 浮动
    1. float 不是 none
3. 绝对定位的元素
    1. position: absolute
    2. position: fixed
4. 非块级元素
    1. inline-block
    2. flow-root
    3. table相关
    4. flex相关
    5. grid相关
5. 块级元素
    1. overflow不是visible

### inline-block与flow-root比较

1. inline-block等价于display: inline flow-root，展示为行内元素
2. flow-root等价于display: block flow-root，展示为块元素
3. 对内创建BFC

## BFC作用

### 垂直margin重叠处理

#### 计算方式

1. 全正/负数，取绝对值大的
2. 一正一负，取相减绝对值

#### 解决方式

##### 兄弟外边距折叠

1. 兄弟元素各自放在一个BFC中

##### 父子外边距折叠

1. 父元素/子元素设定BFC
2. 父元素添加透明边框：border:1px solid transparent

### 清除浮动

1. 创建自适应两栏布局，给被遮挡的元素创建新的BFC

### 包裹浮动元素

1. 解决高度塌陷问题，父元素设置BFC

### 创建两栏布局

1. 左边浮动固定宽
2. 右边设置BFC
