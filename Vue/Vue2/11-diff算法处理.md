##### patch

createPatchFunction返回patch方法用于处理节点挂载

这里只简单说戏patch的挂载方式，详细见11-diff算法处理笔记

1. 如果vnode未定义，则直接返回，若存在oldVnode，则同时销毁oldVnode
2. 若oldVnode未定义（很可能是组件挂载，或初始化），则直接createElm创建新元素
3. oldVnode存在，则分条件判断如何更新
   1. 新旧节点sameVnode相同，则执行patchVnode，用diff处理
   2. 否则替换当前元素
      1. 获取当前旧节点和他的父亲
      2. 创建新元素，内部包含组件的初始化逻辑
      3. 递归更新占位符
      4. 销毁旧组件

```JS
export function createPatchFunction(backend) {
    // 处理patch所需的方法和属性
    // ...
    // 返回patch方法
    return function patch(oldVnode, vnode, hydrating, removeOnly) {
        // 如果vnode未定义，则直接返回
        if (isUndef(vnode)) {
            // oldVnode定义了，则销毁oldVnode的Hook
            if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
            return
        }
        let isInitialPatch = false
        const insertedVnodeQueue = []

        if (isUndef(oldVnode)) {
            // 若oldVnode未定义（很可能是组件挂载，或初始化），则直接createElm创建新元素
            isInitialPatch = true
            createElm(vnode, insertedVnodeQueue)
        } else {
            // oldVnode存在，则分条件判断如何更新
            const isRealElement = isDef(oldVnode.nodeType)
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // 1. 新旧节点sameVnode相同，则执行patchVnode，用diff处理
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
            } else {
                // 2. 否则替换当前元素
                // ...
                // 获取当前旧节点和他的父亲
                const oldElm = oldVnode.elm
                const parentElm = nodeOps.parentNode(oldElm)
                // 创建新元素，内部包含组件的初始化逻辑
                createElm(
                    vnode,
                    insertedVnodeQueue,
                    oldElm._leaveCb ? null : parentElm,
                    nodeOps.nextSibling(oldElm)
                )
                // 递归更新占位符
                // ...
                // 销毁旧组件
                if (isDef(parentElm)) {
                    removeVnodes([oldVnode], 0, 0)
                } else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode)
                }
            }
        }
        // 调用插入的钩子 => callInsert
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
        return vnode.elm

    }
}
```
