# Array

有序的数据集合

## 数组方法

### 纯函数（返回处理结果为新数组）

1. map
2. filter
3. concat（数组浅拷贝）
4. join（数组的toString就是调用数组的join）
5. slice
   1. 切片数组，可用作数组浅拷贝
   2. 参数
      1. start
      2. end
      3. 参数值为负数则表示从右边开始

### 非纯函数（对原数组修改，或返回结果不正确）

#### 修改原数组

1. pop
2. push
3. shift
4. unshift
5. sort
6. splice
   1. 剪接数组
   2. 参数
      1. start
      2. count
      3. 之后是添加进数组的数值
   3. 返回值为被删除的部分
7. flat

#### 返回结果不正确

1. forEach
2. some
3. every
4. reduce

## 类数组对象

具有length属性和索引属性的对象，但是没有数组常见的方法

### 常见类数组对象

1. arguments
2. DOM方法返回值

### 转化方式

1. Array.from(arrayLike);
2. Array.prototype.slice.call(arrayLike);
3. Array.prototype.concat.apply([], arrayLike);
4. Array.prototype.splice.call(arrayLike, 0);

## 数组去重：[详见JavaScript/手写代码/数组相关](../08-代码手写/02-数组相关.md)

### ES6

1. 利用Set可以快速去重
2. Array.from再将Set转化为数组

### ES5

1. 维护一个对象map和返回数组res
2. 遍历数组
   1. 当前值map中存在则直接跳过
   2. 不存在则插入res，并修改对应的map值

## 数组扁平化：[详见JavaScript/手写代码/数组相关](../08-代码手写/02-数组相关.md)

### flat

1. flat可以展开数组
2. 参数则是设定展开层级，Infinity为全展开

###  字符串

通过数组转化为字符串的形式处理展开
1. split 和 toString
   1. 数组toString转化成 `1,2,3,4,...` 形式

   2. split用', '分割
2. 正则和 JSON 方法
   1. JSON.stringify转化数组成 `[1,2,[3,4]]` 形式
   2. 正则replace替换左右括号
   3. 添加外层括号
   4. JSON.parse转化回去

### concat递归：concat每次会展开一层

1. 递归
   1. 维护一个result数组
   2. 遍历arr，判断遍历项是否时数组
      1. 是数组则result.concat(flatten(遍历项))
      2. 不是则直接push进result
   3. 返回result
2. reduce
   1. 逻辑差不多，只是reduce负责遍历

### 扩展运算符

1. 不断检测是否存在数组
2. 存在使用拓展运算符不断展开

## 数组方法实现原理：[详见JavaScript/手写代码/数组相关](../08-代码手写/02-数组相关.md)

### flat

1. reduce负责遍历每项获取返回值
2. concat负责一层一层展开
3. 当reduce的cur为数组时则嵌套调用

### push

1. for循环遍历arguments
2. 数组的尾项设置循环值
3. 返回数组长度

### map

1. 创建res
2. 遍历数组，将res推入fn.call的结果
3. 返回res

### filter

1. 类似map
2. 只是推入时判断fn执行结果，看遍历项是否需要推入res
