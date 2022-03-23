#  vnode挂载

## patch

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

## patchVnode

```JS
  function patchVnode(
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
  ) {
      // 1. 新旧节点一致，则直接返回
      if (oldVnode === vnode) {
          return
      }
      if (isDef(vnode.elm) && isDef(ownerArray)) {
          vnode = ownerArray[index] = cloneVNode(vnode)
      }

      const elm = vnode.elm = oldVnode.elm
      // 2. 异步组件处理
      if (isTrue(oldVnode.isAsyncPlaceholder)) {
          if (isDef(vnode.asyncFactory.resolved)) {
              hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
          } else {
              vnode.isAsyncPlaceholder = true
          }
          return
      }
      // 3. 静态组件直接返回
      if (isTrue(vnode.isStatic) &&
          isTrue(oldVnode.isStatic) &&
          vnode.key === oldVnode.key &&
          (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
          vnode.componentInstance = oldVnode.componentInstance
          return
      }
      // 4. 组件prepatch钩子触发
      let i
      const data = vnode.data
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
          i(oldVnode, vnode)
      }
      const oldCh = oldVnode.children
      const ch = vnode.children
      if (isDef(data) && isPatchable(vnode)) {
          for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
          if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
      }
      // 5. 节点比对
      if (isUndef(vnode.text)) {
          // 非文本标签处理
          if (isDef(oldCh) && isDef(ch)) {
              // 新旧孩子都有，孩子不同updateChildren从而diff更新孩子
              if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
          } else if (isDef(ch)) {
              // 仅有新孩子
              if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '') // 清空旧孩子的文本
              // 增加新孩子
              addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
          } else if (isDef(oldCh)) {
              // 仅有旧孩子
              removeVnodes(oldCh, 0, oldCh.length - 1)
          } else if (isDef(oldVnode.text)) {
              // 新旧都没孩子，但是旧的存在文本
              nodeOps.setTextContent(elm, '')
          }
      } else if (oldVnode.text !== vnode.text) {
          // 文本标签处理
          nodeOps.setTextContent(elm, vnode.text)
      }
      // 6. postpatch钩子触发
      if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
      }
  }
```

## updateChildren

子节点diff处理
1. 旧节点为空处理
2. 头头相同，头节点后移
3. 尾尾相同，尾节点前移
4. 头尾相同，右移，旧头节点移动至旧尾节点后，头节点后移，尾节点前移
5. 尾头相同，左移，旧尾节点移动至旧头节点前，头节点后移，尾节点前移
6. 乱序处理
   1. 获取旧节点映射oldKeyToIdx
   2. 获取映射中与新头节点key相同的值
   3. 是否存在映射的值
      1. 不存在直接创建节点，并插到旧头节点之前
      2. 存在，则获取节点，看节点是否相同分别处理
   4. 新头节点index后移
7. 剩余节点处理
   1. 新节点剩余，添加新节点
   2. 旧节点剩余，删除旧节点

```JS
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm
    const canMove = !removeOnly
    // diff双指针
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) { // 旧开始节点为空
            oldStartVnode = oldCh[++oldStartIdx]
        } else if (isUndef(oldEndVnode)) { // 旧结束节点为空
            oldEndVnode = oldCh[--oldEndIdx]
        } else if (sameVnode(oldStartVnode, newStartVnode)) { // 旧开始节点和新开始节点相同
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) { // 旧结束节点和新结束节点相同
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // 旧开始节点和新结束节点相同
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // 旧结束节点和新开始节点相同
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        } else { // 乱序diff处理
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            idxInOld = isDef(newStartVnode.key) ?
                oldKeyToIdx[newStartVnode.key] :
                findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
            if (isUndef(idxInOld)) {
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
                vnodeToMove = oldCh[idxInOld]
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                    oldCh[idxInOld] = undefined
                    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
                } else {
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
                }
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}
```
