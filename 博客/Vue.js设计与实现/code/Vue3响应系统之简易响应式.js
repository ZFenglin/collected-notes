// /**
//  * 简易实现
//  */
// const bucket = new Set() // 使用set防止重复收集
// // 创建响应式对象
// const data = { text: 'hello' }
// const obj = new Proxy(data, {
//     get(target, key) {
//         bucket.add(effect) // 收集effect
//         return target[key]
//     },
//     set(target, key, newVal) {
//         target[key] = newVal
//         bucket.forEach(fn => fn()) // 遍历执行effect
//         return true
//     }
// })
// // 创建effect函数
// const effect = function () {
//     console.log(obj.text)
// }
// // 测试
// effect()
// obj.text = 'hello vue3'
// // hello
// // hello vue3

/**
 * 完善处理
 */

/// effect处理
// effect创建
let activeEffect
function effect(fn) {
    if (fn && typeof fn === 'function') {
        activeEffect = fn
        fn()
    }
}
// // effect使用
// effect(() => console.log(obj.text))

// 依赖关系收集处理
const bucket = new WeakMap()
function track(target, key) {
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) bucket.set(target, (depsMap = new Map()))
    let deps = depsMap.get(key)
    if (!deps) depsMap.set(key, (deps = new Set()))
    deps.add(activeEffect)
}
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
}
// 响应式对象处理
const data = { text: 'hello' }
const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
        return true
    }
})
// 测试
effect(() => console.log('effect1', obj.text))
effect(() => console.log('effect2', obj.text))
obj.text = 'hello vue3'
// effect1 hello
// effect2 hello
// effect1 hello vue3
// effect2 hello vue3

/**
 * 剩余完善
 */
// // 分支切换
// effect(() => document.body.innerText = obj.ok ? obj.text : 'none')
// const set = new Set([1])
// set.forEach(value => {
//     set.delete(1)
//     set.add(1)
//     console.log('遍历中')
// })
// // 嵌套effect
// effect(function effect1() {
//     effect(function effect2() {
//         console.log('effect2', obj.bar)
//     })
//     console.log('effect1', obj.foo)
// })
// // 无限递归
// effect(() => {
//     obj.foo = obj.foo + 1
// })