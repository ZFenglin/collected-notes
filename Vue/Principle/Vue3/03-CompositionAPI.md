# CompositionAPI

Composition API 可以让我们更好地组织代码结构

## 设计动机

![两种API比较](./assets/03-两种API比较.webp)

### Options API（vue2采用方式）

包含一个描述组件的选项（data，methods等），具有以下缺陷：

1. 开发复杂组件，同一功能逻辑拆分在不同地方，调试代码麻烦需要上下拖动
2. Vue组件过于依赖this上下文，methods 中的this竟然指向组件实例来不指向methods所在的对象

### Composition API

1. 一组基于函数的API，它的使用没有位置的规范
2. 具有更加灵活的组件逻辑，甚至可以将组建的逻辑抽离到一个方法中导出

#### 鼠标监听逻辑

```js
// utils/mouse.js
import {
    ref,
    onMounted,
    onUnmounted
} from 'vue'

export function useMouse() {
    const x = ref(0)
    const y = ref(0)

    function update(e) {
        x.value = e.pageX
        y.value = e.pageY
    }
    onMounted(() => {
        window.addEventListener('mousemove', update)
    })

    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    })
    return {
        x,
        y
    }
}

// 组件内直接使用
let {
    x,
    y
} = useMouse()
```

#### style中支持数据绑定

```html
<script setup>
    let color = ref('red')

    function change() {
        color.value = Math.random() > 0.5 ? "blue" : "red"
    }
</script>

<style scoped>
    h1 {
        color: v-bind(color);
    }
</style>
```

## 使用方式

### 创建实例

1. createApp用于创建组件
2. 内部可以使用setup
   1. setup中的代码就是beforeCreate和created时执行
   2. 其他生命周期的就是在之前的增加on开头

### 创建响应式对象

1. reactive：将传入对象变成响应式
2. toRefs：将对象的所有属性都变成响应式对象
3. ref：将普通数据包装一个对象成为响应式

### 计算属性与侦听器

#### computed

计算属性，向computed中传入具有get和set的对象可以实现

```js
const fullName = computed({
    get() {
        return firstName.value + ' ' + lastName.value
    },
    set(newValue) {
        [firstName.value, lastName.value] = newValue.split(' ')
    }
})
```

#### watch

1. 传入的值应当是响应式处理过的对象，watch只追踪明确侦听的源
2. watch()是懒执行的，仅在侦听源变化时，才会执行回调
3. 返回值为取消监听函数

```js
watch(
    () => state.someObject,
    (newValue, oldValue) => {}, {
        deep: true
    }
)
```

#### WatchEffect

1. watchEffect会在副作用发生期间追踪依赖，它会在同步执行过程中，自动追踪所有能访问到的响应式 property
2. 返回值时取消监听函数

```js
async function fetchData() {
    const response = await fetch(url.value)
    data.value = await response.json()
}
watch(url, fetchData)

// watchEffect由于自动追踪所有能访问到的响应式，所以可以简化为
// 这里会自动追踪 url.value 作为依赖
watchEffect(async () => {
    const response = await fetch(url.value)
    data.value = await response.json()
})
```

## 与React Hook区别

Compositon API思路借鉴React Hook

### React Hook存限制

1. 不能在循环、条件、嵌套函数中调用Hook
2. 必须确保总是在你的React函数的顶层调用Hook
3. useEffect、useMemo等函数必须手动确定依赖关系

### 两者区别

1. 渲染区别
   1. 声明在setup函数内，一次组件实例化只调用一次setup
   2. React Hook每次重渲染都需要调用Hook，使得React的GC比Vue更有压力
2. 循环区别：Compositon API的调用不需要顾虑调用顺序，可以在循环、条件、嵌套函数中使用
3. 依赖区别
   1. 响应式系统自动实现了依赖收集，组件的部分的性能优化由Vue内部自己完成
   2. React Hook需要手动传入依赖，而且必须必须保证依赖的顺序
