# Component处理

VueRouter在install中注册RouterLink和RouterView两个组件在全局使用

## RouterLink

1. 相关属性声明和处理
2. 点击触发事件on创建和设置
3. data声明
4. scopedSlot处理
5. 标签增加对应属性和on事件
6. 返回处理好的渲染函数

```JS
export default {
    name: 'RouterLink',
    props: {
        to: {
            type: toTypes,
            required: true
        },
        // 其它属性
        //  ...
    },
    render(h) {
        // 相关属性声明和处理
        // ...
        // 点击触发事件on创建和设置
        const handler = e => {
            if (guardEvent(e)) {
                // 调用路由实例的replace或push
                if (this.replace) {
                    router.replace(location, noop)
                } else {
                    router.push(location, noop)
                }
            }
        }
        const on = {
            click: guardEvent
        }
        if (Array.isArray(this.event)) {
            this.event.forEach(e => {
                on[e] = handler
            })
        } else {
            on[this.event] = handler
        }
        // data声明
        const data = {
            class: classes
        }
        // scopedSlot处理
        // ...
        // 标签增加对应属性
        if (this.tag === 'a') {
            // a标签data属性处理和on事件添加
            // ...
        } else {
            // 其它标签data处理和on事件添加
            // ...
        }
        // 返回处理好的渲染函数
        return h(this.tag, data, this.$slots.default)
    }
}
```

## RouterView

1. 设置当前标签为routerView
2. 不断向上访问找到当前的RouterView的层级depth
3. 找到对应的当前RouterView对应的记录matched，并获取component
4. 不存在matched或component，则渲染空标签
5. 缓存组件
6. 返回处理好的渲染函数

```JS
export default {
    name: 'RouterView',
    functional: true,
    props: {
        name: {
            type: String,
            default: 'default'
        }
    },
    render(_, {
        props,
        children,
        parent,
        data
    }) {
        // 设置当前标签为routerView
        data.routerView = true
        // 相关属性声明
        // ...
        // 不断向上访问找到当前的RouterView的层级depth
        let depth = 0
        let inactive = false
        while (parent && parent._routerRoot !== parent) {
            const vnodeData = parent.$vnode ? parent.$vnode.data : {}
            if (vnodeData.routerView) {
                depth++
            }
            if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
                inactive = true
            }
            parent = parent.$parent
        }
        data.routerViewDepth = depth
        // inactive处理
        if (inactive) {
            // ...
        }
        // 找到对应的当前RouterView对应的记录matched，并获取component
        const matched = route.matched[depth]
        const component = matched && matched.components[name]
        // 不存在matched或component，则渲染空标签
        if (!matched || !component) {
            cache[name] = null
            return h()
        }
        // 缓存组件
        cache[name] = {
            component
        }
        // 其它处理
        // ...
        // 返回处理好的渲染函数
        return h(component, data, children)
    }
}
```
