function BinarySearchTree() {
    function Node(key) {
        this.key = key
        this.left = null
        this.right = null
    }
    this.root = null
    // 插入
    BinarySearchTree.prototype.insert = function (key) {
        var newNode = new Node(key)
        if (!this.root) {
            this.root = newNode
        } else {
            this._insertNode(this.root, newNode)
        }
    }
    BinarySearchTree.prototype._insertNode = function (node, newNode) {
        if (newNode.key < node.key) {
            // 向左
            if (node.left == null) {
                node.left = newNode
            } else {
                this._insertNode(node.left, newNode)
            }
        } else {
            // 向右
            if (node.right == null) {
                node.right = newNode
            } else {
                this._insertNode(node.right, newNode)
            }
        }
    }
    // 先序遍历
    BinarySearchTree.prototype.preOrderTraversal = function (handler) {
        this.preOrderTraversalNode(this.root, handler)
    }
    BinarySearchTree.prototype.preOrderTraversalNode = function (node, handler) {
        if (!!node) {
            // 处理节点
            handler(node.key)
            // 左子树处理
            this.preOrderTraversalNode(node.left, handler)
            // 右子树处理
            this.preOrderTraversalNode(node.right, handler)
        }
    }
    // 中序遍历
    BinarySearchTree.prototype.midOrderTraversal = function (handler) {
        this.midOrderTraversalNode(this.root, handler)
    }
    BinarySearchTree.prototype.midOrderTraversalNode = function (node, handler) {
        if (!!node) {
            // 左子树处理
            this.midOrderTraversalNode(node.left, handler)
            // 处理节点
            handler(node.key)
            // 右子树处理
            this.midOrderTraversalNode(node.right, handler)
        }
    }
    // 后序遍历
    BinarySearchTree.prototype.postOrderTraversal = function (handler) {
        this.postOrderTraversalNode(this.root, handler)
    }
    BinarySearchTree.prototype.postOrderTraversalNode = function (node, handler) {
        if (!!node) {
            // 左子树处理
            this.postOrderTraversalNode(node.left, handler)
            // 右子树处理
            this.postOrderTraversalNode(node.right, handler)
            // 处理节点
            handler(node.key)
        }
    }
    // 最小值（最左边节点）
    BinarySearchTree.prototype.min = function () {
        let node = this.root
        let key = null
        while (!!node) {
            key = node.key
            node = node.right
        }
        return key
    }
    // 最大值（最右边节点）
    BinarySearchTree.prototype.max = function () {
        let node = this.root
        let key = null
        while (!!node) {
            key = node.key
            node = node.left
        }
        return key
    }
    // 查找
    BinarySearchTree.prototype.search = function (key) {
        let node = this.root
        while (!!node) {
            if (key < node.key) {
                node = node.left
            } else if (key > node.key) {
                node = node.right
            } else {
                return true
            }
        }
        return false
    }
    // 删除
    BinarySearchTree.prototype.remove = function (key) {
        // 寻找删除节点
        let current = this.root
        let parent = null
        let isLeft = true
        while (current.key !== key) {
            parent = current
            if (key < current.key) {
                isLeft = true
                current = current.left
            } else {
                isLeft = false
                current = current.right
            }
            if (!current) return false
        }
        // 处理节点删除
        if (!current.left && !current.right) { // 叶子节点
            if (current === this.root) {
                this.root = null
            } else if (isLeft) {
                parent.left = null
            } else {
                parent.right = null
            }
        } else if (!current.right) { // 只有左子节点
            if (current === this.root) {
                this.root = current.left
            } else if (isLeft) {
                parent.left = current.left
            } else {
                parent.right = current.left
            }
        } else if (!current.left) { // 只有右子节点
            if (current === this.root) {
                this.root = current.right
            } else if (isLeft) {
                parent.left = current.right
            } else {
                parent.right = current.right
            }
        } else { // 左右节点都存在
            let node = current.right
            while (node.left) {
                node = node.left
            }
            this.remove(node.key)
            current.key = node.key
        }
        return current
    }
}



let bst = new BinarySearchTree()
bst.insert(11)
bst.insert(7)
bst.insert(15)
bst.insert(5)
bst.insert(3)
bst.insert(9)
bst.insert(8)
bst.insert(10)
bst.insert(13)
bst.insert(12)
bst.insert(14)
bst.insert(20)
bst.insert(18)
bst.insert(25)
bst.insert(6)

bst.remove(9)
bst.remove(7)
bst.remove(15)

var str = ""
bst.postOrderTraversal(function (key) {
    str += key + " "
})


console.log(str)

// console.log(bst.max())
// console.log(bst.min())

// console.log(bst.search(3))
// console.log(bst.search(5))
// console.log(bst.search(21))