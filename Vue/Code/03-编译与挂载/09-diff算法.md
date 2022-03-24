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
