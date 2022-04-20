# Map和Set

## [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

1. 对象保存键值对
2. 键可以为任意值
   

### Map操作方法

1. size：返回Map结构的成员总数
2. set(key, value)：设置键名key对应的键值value，然后返回整个Map结构
   1. 如果key已经有值，则键值会被更新
   2. 否则就新生成该键
   3. 因为返回的是当前Map对象，所以可以链式调用
3. get(key)：该方法读取key对应的键值，如果找不到key，返回undefined
4. has(key)：该方法返回一个布尔值，表示某个键是否在当前Map对象中
5. delete(key)：该方法删除某个键，返回true，如果删除失败，返回false
6. clear()：map.clear()清除所有成员，没有返回值

### Map与Object区别

1. 意外的键
   1. Map默认情况不包含任何键，只有显式插入的键
   2. Object有原型可能与插入的键冲突
2. 键的类型
   1. Map的键可以为任意值
   2. Object的键必须为String或Symbol（传入其他格式则是会调用它自身的toString方法）
3. 键的顺序
   1. Map的键按照插入顺序
   2. Object的键是无序的
4. Size
   1. Map的键值对数量可以通过size获取
   2. Object只能手动计算
5. 迭代
   1. Map是iterable的，存在Symbol(Symbol.iterator)迭代器
   2. Object的迭代需要获取它的键再进行迭代（或者自己设定Symbol.iterator）
6. 性能
   1. Map的频繁删减有优化
   2. Objcet对频繁删减未优化，但是Object的查询更快些

## [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

1. 对象是值的集合
2. 元素是唯一的
3. set操作方法其实差不多，但是要注意set的添加是add，并且返回Set对象，说明可以链式调用

## WeakMap/WeakSet（仅说明WeakMap）

1. WeakMap 对象也是一组键值对的集合，其中的键是弱引用的
2. 其键必须是对象，原始数据类型不能作为key值，而值可以是任意的

### 弱引用

而WeakMap的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内

1. 只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存
2. 一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用

### 存在方法

1. set(key, value)
2. get(key)
3. has(key)
4. delete(key)
5. 不需要clear是因为WeakMap弱引用
