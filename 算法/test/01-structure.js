// // // function LinkedList() {
// // //     function Node(data) {
// // //         this.value = data
// // //         this.next = null
// // //     }
// // //     this.length = 0
// // //     this.head = null
// // //     // 原型方法
// // //     LinkedList.prototype.append = function (data) {
// // //         const newNode = new Node(data)
// // //         if (this.length === 0) {
// // //             this.head = newNode
// // //         } else {
// // //             let current = this.head
// // //             while (current.next) { current = current.next }
// // //             current.next = newNode
// // //         }
// // //         this.length++
// // //     }
// // //     LinkedList.prototype.toString = function () {
// // //         let str = ''
// // //         let current = this.head
// // //         while (current) {
// // //             str += current.value + ' '
// // //             current = current.next
// // //         }
// // //         return str
// // //     }
// // //     LinkedList.prototype.insert = function (position, data) {
// // //         if (position < 0 || position > this.length) return false
// // //         const newNode = new Node(data)
// // //         if (position === 0) {
// // //             newNode.next = this.head
// // //             this.head = newNode
// // //         } else {
// // //             let index = 0
// // //             let previous = this.head
// // //             position--
// // //             while (index++ < position) {
// // //                 previous = previous.next
// // //             }
// // //             newNode.next = previous.next
// // //             previous.next = newNode
// // //         }
// // //         this.length++
// // //     }
// // //     LinkedList.prototype.get = function (position) {
// // //         if (position < 0 || position >= this.length) return null
// // //         let current = this.head
// // //         while (position) {
// // //             current = current.next
// // //             position--
// // //         }
// // //         return current
// // //     }
// // //     LinkedList.prototype.indexOf = function (value) {
// // //         let current = this.head
// // //         let index = 0
// // //         while (current) {
// // //             if (current.value === value) return index
// // //             current = current.next
// // //             index++
// // //         }
// // //         return null
// // //     }
// // //     LinkedList.prototype.update = function (position, value) {
// // //         const node = this.get(position)
// // //         if (node) {
// // //             node.value = value
// // //             return true
// // //         }
// // //         return false
// // //     }
// // //     LinkedList.prototype.removeAt = function (position) {
// // //         if (position < 0 || position >= this.length) return false
// // //         if (position === 0) {
// // //             this.head = this.head.next
// // //         } else {
// // //             let previous = this.head
// // //             while (--position) {
// // //                 previous = previous.next
// // //             }
// // //             previous.next = previous.next.next
// // //         }
// // //         this.length--
// // //         return true
// // //     }
// // //     LinkedList.prototype.remove = function (value) {
// // //         let current = this.head
// // //         let previous = null
// // //         while (current) {
// // //             if (current.value === value) {
// // //                 previous.next = previous.next.next
// // //                 this.length--
// // //                 return true
// // //             }
// // //             previous = current
// // //             current = current.next
// // //         }
// // //         return false
// // //     }
// // //     LinkedList.prototypel.isEmpty = function () {
// // //         return this.length === 0
// // //     }
// // //     LinkedList.prototype.size = function () {
// // //         return this.length
// // //     }
// // // }


// // // const linkedList = new LinkedList()

// // // linkedList.append(1)
// // // linkedList.append(2)
// // // linkedList.append(3)
// // // linkedList.append(4)

// // // linkedList.insert(4, 'a')
// // // linkedList.insert(4, 'b')
// // // linkedList.insert(4, 'c')
// // // linkedList.update(4, 'd')

// // // console.log(linkedList.remove('d'))

// // // console.log(linkedList.toString(), linkedList.indexOf('c'))


// // function DoubleLinkedList() {
// //     function Node(value) {
// //         this.value = value
// //         this.prev = null
// //         this.next = null
// //     }
// //     this.head = null
// //     this.tail = null
// //     this.length = 0
// //     // 原型方法
// //     DoubleLinkedList.prototype.append = function (value) {
// //         const newNode = new Node(value)
// //         if (this.length === 0) {
// //             this.head = newNode
// //             this.tail = newNode
// //         } else {
// //             newNode.prev = this.tail
// //             this.tail.next = newNode
// //             this.tail = newNode
// //         }
// //         this.length++
// //     }
// //     DoubleLinkedList.prototype.toString = function () {
// //         return this.backwardToString()
// //     }
// //     DoubleLinkedList.prototype.forwawrdToString = function () {
// //         let str = ''
// //         let current = this.tail
// //         while (current) {
// //             str += current.value + ' '
// //             current = current.prev
// //         }
// //         return str
// //     }
// //     DoubleLinkedList.prototype.backwardToString = function () {
// //         let str = ''
// //         let current = this.head
// //         while (current) {
// //             str += current.value + ' '
// //             current = current.next
// //         }
// //         return str
// //     }
// //     DoubleLinkedList.prototype.insert = function (position, value) {
// //         if (position < 0 || position > this.length) return false
// //         const newNode = new Node(value)
// //         if (this.length === 0) {
// //             // 无节点情况
// //             this.head = newNode
// //             this.tail = newNode
// //         } else {
// //             // 存在节点
// //             if (position === 0) {
// //                 // 插入开头
// //                 this.head.prev = newNode
// //                 newNode.next = this.head
// //                 this.head = newNode
// //             } else if (position === this.length) {
// //                 // 插入结尾
// //                 newNode.prev = this.tail
// //                 this.tail.next = newNode
// //                 this.tail = newNode
// //             } else {
// //                 // 中间插入
// //                 const fromHead = position <= (this.length / 2)
// //                 let step = fromHead ? (position - 1) : (this.length - position)
// //                 let prevNode = fromHead ? this.head : this.tail
// //                 if (fromHead) {
// //                     while (step--) { prevNode = prevNode.next }
// //                 } else {
// //                     while (step--) { prevNode = prevNode.prev }
// //                 }
// //                 let nextNode = prevNode.next
// //                 newNode.prev = prevNode
// //                 newNode.next = nextNode
// //                 prevNode.next = newNode
// //                 nextNode.prev = newNode
// //             }
// //         }
// //         this.length++
// //     }
// //     DoubleLinkedList.prototype.get = function (position) {
// //         if (position < 0 || position >= this.length) return false
// //         const fromHead = position <= (this.length / 2)
// //         let step = fromHead ? position : (this.length - position - 1)
// //         let node = fromHead ? this.head : this.tail
// //         if (fromHead) {
// //             while (step--) { node = node.next }
// //         } else {
// //             while (step--) { node = node.prev }
// //         }
// //         return node
// //     }
// //     DoubleLinkedList.prototype.indexOf = function (value) {
// //         var current = this.head
// //         var index = 0
// //         while (current) {
// //             if (current.value === value) return index
// //             current = current.next
// //             index++
// //         }
// //         return -1
// //     }
// //     DoubleLinkedList.prototype.update = function (position, value) {
// //         const node = this.get(position)
// //         if (!node) return false
// //         node.value = value
// //         return node
// //     }
// //     DoubleLinkedList.prototype.removeAt = function (position) {
// //         if (this.length == 1) {
// //             this.head = null
// //             this.tail = null
// //         } else {
// //             const node = this.get(position)
// //             if (!node) return null
// //             if (!node.prev) {
// //                 this.head.next.prev = null
// //                 this.head = this.head.next
// //             } else if (!node.next) {
// //                 this.tail.prev.next = null
// //                 this.tail = this.tail.prev
// //             } else {
// //                 node.prev.next = node.next
// //                 node.next.prev = node.prev
// //             }
// //             this.length--
// //             return node
// //         }
// //     }
// //     DoubleLinkedList.prototype.remove = function (value) {
// //         const index = this.indexOf(value)
// //         return this.removeAt(index)
// //     }
// //     DoubleLinkedList.prototype.isEmpty = function () {
// //         return this.length === 0
// //     }
// //     DoubleLinkedList.prototype.size = function () {
// //         return this.length
// //     }
// //     DoubleLinkedList.prototype.getHead = function () {
// //         return this.head
// //     }
// //     DoubleLinkedList.prototype.getTail = function () {
// //         return this.tail
// //     }
// // }

// // const doubleLinkedList = new DoubleLinkedList()

// // doubleLinkedList.append(1)
// // doubleLinkedList.append(2)
// // doubleLinkedList.append(3)
// // doubleLinkedList.append(4)
// // doubleLinkedList.insert(1, 'a')


// // console.log(doubleLinkedList.toString(), doubleLinkedList.removeAt(0))
// // console.log(doubleLinkedList.toString())


// function Set() {
//     this.items = {}
//     Set.prototype.has = function (value) {
//         return this.items.hasOwnProperty(value)
//     }
//     Set.prototype.add = function (value) {
//         if (this.has(value)) return false
//         this.items[value] = value
//         return true
//     }
//     Set.prototype.remove = function (value) {
//         if (!this.has(value)) return false
//         delete this.items[value]
//         return true
//     }
//     Set.prototype.clear = function () {
//         this.items = {}
//     }
//     Set.prototype.size = function () {
//         return Object.keys(this.items).length
//     }
//     Set.prototype.values = function () {
//         return Object.keys(this.items)
//     }
//     // 集合间操作
//     Set.prototype.union = function (otherSet) {
//         var unionSet = new Set()
//         var values = this.values()
//         for (let i = 0; i < values.length; i++) {
//             unionSet.add(values[i])
//         }
//         values = otherSet.values()
//         for (let i = 0; i < values.length; i++) {
//             unionSet.add(values[i])
//         }
//         return unionSet
//     }
//     Set.prototype.intersection = function (otherSet) {
//         var intersectionSet = new Set()
//         var values = this.values()
//         for (let i = 0; i < values.length; i++) {
//             var item = values[i]
//             if (otherSet.has(item)) {
//                 intersectionSet.add(item)
//             }
//         }
//         return intersectionSet
//     }
//     Set.prototype.difference = function (otherSet) {
//         var differenceSet = new Set()
//         var values = this.values()
//         for (let i = 0; i < values.length; i++) {
//             var item = values[i]
//             if (!otherSet.has(item)) {
//                 differenceSet.add(item)
//             }
//         }
//         return differenceSet
//     }
//     Set.prototype.subset = function (otherSet) {
//         var values = this.values()
//         for (let i = 0; i < values.length; i++) {
//             const item = values[i];
//             if (!otherSet.has(item)) {
//                 return false
//             }
//         }
//         return true
//     }
// }


// 哈希表

console.log(hashFunction('abc', 7))
console.log(hashFunction('cba', 7))
// 哈希类
function HashTable() {
    // 属性
    this.storage = []
    this.count = 0
    this.limit = 7
    // 哈希函数
    HashTable.prototype.hashFunction = function (str, size) {
        // 1. 将字符串转化成比较大的数字
        let hashCode = 0
        for (let i = 0; i < str.length; i++) {
            hashCode = 37 * hashCode + str.charCodeAt(i)
        }
        return hashCode % size
    }
    // 插入和修改
    HashTable.prototype.put = function (key, value) {
        let index = this.hashFunction(key, this.limit)
        let bucket = this.storage[index]
        if (bucket == null) {
            bucket = []
            this.storage[index] = bucket
        }
        for (let i = 0; i < bucket.length; i++) {
            const tuple = bucket[i]
            if (tuple[0] == key) {
                tuple[1] = value
                return
            }

        }
        bucket.push([key, value])
        this.count++
    }
    // 获取操作
    HashTable.prototype.get = function (key) {
        let index = this.hashFunction(key, this.limit)
        let bucket = this.storage[index]
        if (!!bucket) {
            return null
        }
        for (let i = 0; i < bucket.length; i++) {
            const tuple = bucket[i];
            if (tuple[0] == key) {
                return tuple[1]
            }
        }
        return null
    }
}