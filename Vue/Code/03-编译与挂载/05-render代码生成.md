# render代码生成

## render范例

例如以下一个Vue的模板

```HTML
<ul :class="bindCls" class="list" v-if="isShow">
    <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
</ul>
```
而转化后的render的函数

```JS
with(this){
  return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return _c('li', {
          on: {
            "click": function($event) {
              clickItem(index)
            }
          }
        },
        [_v(_s(item) + ":" + _s(index))])
      })
    ) : _e()
}
```
这个_c等方法，在renderMixin时会调用installRenderHelpers时向Vue.prototype上增加对应的标签处理方法

## 代码生成入口

generate将传入的ast对象树转化为嵌套方法

```JS
export function generate(ast, options) {
    // 获取state，存储相关状态
    const state = new CodegenState(options)
    // genElement处理代码生成
    const code = ast ? (ast.tag === 'script' ? 'null' : genElement(ast, state)) : '_c("div")'
    // 返回处理好的render对象
    return {
        render: `with(this){return ${code}}`,
        staticRenderFns: state.staticRenderFns
    }
}
```

### genElement

genElement用于处理渲染函数代码生成

通过判断不同的ast类型，分别处理

```JS
export function genElement(el, state) {
    if (el.parent) {
        el.pre = el.pre || el.parent.pre
    }
    if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
        return genOnce(el, state)
    } else if (el.for && !el.forProcessed) { // v-for
        return genFor(el, state)
    } else if (el.if && !el.ifProcessed) { // v-if
        return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
        return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
        return genSlot(el, state)
    } else {
        // 元素或者组件
        let code
        if (el.component) {
            // 组件代码生成
            code = genComponent(el.component, el, state)
        } else {
            // 元素代码生成
            let data
            if (!el.plain || (el.pre && state.maybeComponent(el))) {
                data = genData(el, state)
            }
            // 获取children代码
            const children = el.inlineTemplate ? null : genChildren(el, state, true)
            // 代码拼接
            code = `_c('${el.tag}'${ data ? `,${data}` : '' }${children ? `,${children}` : ''})`
        }
        // module transforms
        for (let i = 0; i < state.transforms.length; i++) {
            code = state.transforms[i](el, code)
        }
        return code
    }
}
```
