# 关于JavaScript中强制类型转换的小总结  

最近看了看《你不知道的JavaScript（中卷）》，PS：这个系列我觉得是每个JavaScript学习者必看的书籍。当看到强制类型转换时，发觉自己之前总结的相关笔记存在缺漏。正好自己挺久没更新文章了，所以写一篇文章总（shui）结（wen）一下

## 关于值类型转换

首先看书时纠正了我的一个误区：

将值从一种类型转化为另一种类型被称为**类型转换**，这是显式的。而隐式类型转换则称为**强制类型转换**

但是JavaScript中，统称为强制类型转换，书籍分为：

1. 隐式强制类型转换
2. 显式强制类型转换

可是作者也提到，隐式和显式是相对你而言的，即**当你知道了一个隐式转换的过程和副作用，那对你而言就是显式转换**。因此当你知晓了全部转换规则，也就不存在隐式强制类型转换。

## 转换方式总结

书中将转换的规则分为了三种：ToString、ToNumber和ToBoolean
。但是熟悉转换的朋友都知道，JavaScript中的对象存在一个内部属性用于处理对象的基本类型转化，即ToPrimitive。所以我按照四种类型分别讲述。

### ToPrimitive（对象转化为基本类型）

ToPrimitive对象转化为基本类型的方法

当一个对象转换为对应的原始值时，会调用此函数。此函数具有以下特性：

1. 无法显式调用
2. 调用对象的内部方法 `[[DefaultValue]]` 完成

同时参数为：

1. input：需要转化的值
2. hint：期望转化的类型

hint在处理Date对象时，默认值为string，其它则默认为number

而转化方式优先级为：

当hint === number或未设置，按照以下判断执行：

1. valueOf()
2. toString()
3. 抛出TypeError 异常

当hint === string时，按照以下判断执行

1. toString()
2. valueOf()
3. 抛出TypeError 异常

在判断和处理的过程中，只要有一步结果是基本类型，就直接返回

### ToString（其他值转化为字符串）

1. Undefined => "undefined"
2. Null => "null"
3. Boolean
   1. true => "true"
   2. false => "false"
4. Number
   1. NaN => "NaN"
   2. +0或者-0 => "0"
   3. Infinity => "Infinity"
   4. 数字直接转换，会保留负号
5. Symbol => 直接转换，但是只允许显式强制类型转换
6. Object
   1. ToPrimitive(value, string)
   2. 返回值存在基本类型但是不是string，再进行一次ToString()

> **关于JSON的特殊部分:**
>
> 引用书中原话：**toJSON() 应该"返回一个能够被字符串化的安全的JSON值"，而不是"返回一个JSON字符串"**。从而具有以下的特殊部分：
>
> 1. JSON.stringify()在对象中遇到undefined、function和symbol会自动忽略，在数组中则会返回null
> 2. 对象中定义的toJSON方法，则JSON.stringify会首先调用这个方法

### ToNumber（其他值转化为数字）

1. Undefined => NaN
2. Null => 0
3. Boolean
   1. true => 1
   2. false => 0
4. String
   1. "" => 0
   2. "Infinity" => Infinnity
   3. 去掉首尾空格进行转化，有效数字直接转化，无效则返回NaN
5. Symbol => 无法进行转换
6. Object
   1. ToPrimitive(value, number)
   2. 返回值存在基本类型但是不是number，再进行一次ToNumber()

### ToBoolean（其他值转换为布尔值）

1. Undefined => false
2. Null => false
3. String
   1. "" => false
   2. 其它为true
4. Number
   1. +0 或 -0 或 NaN => false
   2. 其它为true
5. Object => true

## 转换方式触发总结

当前我们已经知道了不同类型的转换方式，接下来就需要知道ToNumber，ToString和ToBoolean何时会触发。我这里按照书中的分类进行总结。

### 显式强制类型转换

#### 字符串和数字之间转换

这种转换通过String()和Number()这两个内建函数处理，它们的转化方式如下：

1. Number() => ToNumber
2. String() => ToString

同时，在值的前面添加`+`则会触发对该值的Number()转化，例如：

```javascript
var timestamp = + new Date() // 但是书中还是推荐使用Date.now()获取
```

#### 显式解析字符串

这里就是ParseInt的用法，不同于Number()，它具有一些特性：

参数第一个为转化值，第二个为转化的进制。并且只会解析到能解析的部分

```javascript
parseInt('110px', 2) // 6
```

会将传入的值强制转换为字符串

```javascript
parseInt(1/0, 19) // 18，因为1/0会转换成Infinity
```

#### 显式转换为布尔值

主要为以下两种

1. Boolean() => ToBoolean
2. !!value

### 隐式强制类型转换

大多数让人搞不清的就是隐式强制类型转换

#### 字符串和数字间的隐式强制类型转换

##### a+b

1. 存在对非字符串进行ToString后拼接
2. 不存在则都按照ToNumber转换
   1. 当转化出一个string类型时，还是按照ToString后拼接

同时有一些题目存在以下的特殊情况：

1. function：返回值为代码字符串
2. {}
   1. 语句块 > 函数 > 对象字面量([object Object])
   2. 所以{}+1等价于{}; +1
3. []
   1. 因为valueOf转化的结果是就是空数组自身
   2. 转而使用ToString（等价于调用join），返回""

##### a-b，a*b与a/b

进行ToNumbe转换

#### 隐式转换为布尔值

存在以下情况进行ToBoolean转换：

1. a && b与a || b
2. if(a)
3. for(.., a, ..)
4. while(a)与do...while(a)
5. a? :

#### 宽松相等和严格相等

##### a == b

1. 类型相同比较两者大小
2. 不同执行类型转换
   1. null == undefined => 返回ture
   2. number == string => ToNumber转换string，再按照流程重新处理
   3. boolean == any => ToNumber转换bool，再按照流程重新处理
   4. object == string 或 number 或 symbol => ToNumber转换object，再按照流程重新处理

##### 相等比较方法

1. ==：会进行隐式转换在比较，推荐只在判断null和undefined时使用
2. ===（优先使用）：直接比较，不会进行转换
3. Object.is()
   1. 一般与===相同
   2. -0与+0不相等
   3. 两个NaN相等

#### 大小比较

##### a > b与a < b

1. 操作数有对象则执行 ToPrimitive(对象, null)
2. 比较
   1. 双方出现非字符串 => 对非字符串执行ToNumber，然后再比较
   2. 比较双方都是字符串 => 按字母顺序进行比较

##### a ≥ b和a ≤ b

1. a ≤ b  => !(a > b)
2. a ≥ b => !(a < b)

## 结语

本文作为挺久未更的第一个文章，最近也有些事情也让我感触挺多的。发觉保持写作也是件值得各位一起坚持的事，所以目前想立个flag，一周一篇小文章吧，就当督促自己坚持学习了。正所谓书中自有黄金屋，所以希望看到这篇文章的小伙伴一定要坚持学习啊。努力提升自己才是最重要的！！！

最后，**你不知道的JavaScript这个系列真的非常好，大家没看过的一定要去看看！！！！！**
