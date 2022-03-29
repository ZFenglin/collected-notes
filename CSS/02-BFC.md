# [BFC](https://zhuanlan.zhihu.com/p/25321647)

Block Format Context：块级格式化上下文

独立的渲染区域
1. 内部元素按照容器规则进行摆放
2. 内部元素的处理不会影响外部元素，也不会被外部影响

## [BFC特性](https://segmentfault.com/a/1190000009545742)

内部元素的处理不会影响外部元素，也不会被外部影响

### 对内

1. 内部盒子垂直方向上自上而下排列
2. 内部元素的 margin-left 和容器的左 border 相接触
3. 同一BFC的盒子的垂直外边距会重叠

### 对外

1. 不会与浮动元素重叠，可以用于清除浮动或者对兄弟元素设定BFC防止其被之前浮动元素覆盖
2. 计算BFC高度，浮动元素也会参与计算

## 创建BFC

### 根元素html

### position

1. absolute
2. fixed

### float

除none

### overflow

除visible和clip

### display

1. inline-block等价于display: inline flow-root;
2. flow-root等价于display: block flow-root
3. table相关
4. flex相关
5. grid相关

#### inline-block与flow-root比较

1. 对外显示为block或inline
2. 对内创建一个独立的文档布局流，即BFC

### column-count或column-width

除了auto

## BFC作用

### 避免margin重叠

#### 触发方式

1. 属于同一个BFC
2. 没有被padding、border、clear或非空内容隔开
3. 两个或两个以上垂直方向的相邻元素

#### 计算方式

1. 全正/负数，取绝对值大的
2. 一正一负，取相减绝对值

#### 解决方式

##### 兄弟外边距折叠

兄弟元素各自放在一个BFC中

##### 父子外边距折叠

1. 父元素/子元素设定BFC
2. 父元素添加透明边框：border:1px solid transparent

### 清除浮动

创建自适应两栏布局，给被遮挡的元素创建新的BFC

### 包裹浮动元素

解决高度塌陷问题，父元素设置BFC
