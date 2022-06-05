function ArrayList() {
    this.array = []
}
ArrayList.prototype.insert = function (item) { return this.array.push(item) }
ArrayList.prototype.toString = function () { return this.array.join(',') }
ArrayList.prototype.compare = function (m, n) { return this.array[m] > this.array[n] }
ArrayList.prototype.swap = function (m, n) {
    let temp = this.array[m]
    this.array[m] = this.array[n]
    this.array[n] = temp
}
// 冒泡
ArrayList.prototype.bubbleSort = function () {
    let j = this.array.length - 1
    while (j) {
        for (let i = 0; i < j; i++) {
            //  比较相邻元素大小
            if (this.compare(i, i + 1)) {
                // 交换数据
                this.swap(i, i + 1)
            }
        }
        j--
    }
}
// 选择
ArrayList.prototype.selectionSort = function () {
    let length = this.array.length
    let j = 0
    while (j < length - 1) {
        let min = j
        for (let i = min + 1; i < length; i++) {
            if (this.compare(min, i)) {
                min = i
            }
        }
        this.swap(min, j)
        j++
    }
}
// 插入
ArrayList.prototype.insertionSort = function () {
    let length = this.array.length
    // 外层循环：向前面有序的进行插入
    for (let i = 0; i < length; i++) {
        let temp = this.array[i]
        let j = i
        // 内存循环：获取i元素，和有序的进行比较插入
        while (j > 0 && this.array[j - 1] > temp) {
            this.array[j] = this.array[j - 1]
            j--
        }
        this.array[j] = temp
    }
}
// 希尔
ArrayList.prototype.shellSort = function () {
    let length = this.array.length
    // 获取gap，默认模式
    let getGap = (num) => Math.floor(num / 2)
    // 初始化gap
    let gap = getGap(length)
    // while循环处理，同时gap缩小
    while (gap >= 1) {
        // gap间隔的插入排序处理
        for (let i = gap; i < length; i++) {
            let temp = this.array[i]
            let j = i
            while (j > gap - 1 && this.array[j - gap] > temp) {
                this.array[j] = this.array[j - gap]
                j -= gap
            }
            // 将j位置的元素赋值给temp
            this.array[j] = temp
        }
        // 更新gap
        gap = getGap(gap)
    }
}
// 快速
//  1. 枢纽
ArrayList.prototype.median = function (left, right) {
    let center = Math.floor((left + right) / 2)
    // 利用冒泡排序修改三个节点顺序
    if (this.compare(left, center)) this.swap(left, center)
    if (this.compare(center, right)) this.swap(center, right)
    if (this.compare(left, center)) this.swap(left, center)
    // 将枢纽放到倒数第二位
    this.swap(center, right - 1)
    return this.array[right - 1]

}
// 2. 排序
ArrayList.prototype.quick = function (left, right) {
    // 结束条件
    if (left >= right) return
    // 获取枢纽
    var pivot = this.median(left, right)
    // 左右判断两边交换
    var i = left
    var j = right - 1
    while (i < j) {
        while (this.array[i] < pivot) { i++ }
        while (this.array[j] >= pivot) { j-- }
        if (i < j) {
            this.swap(i, j)
        } else {
            break
        }
    }
    // 将枢纽放在正确位置
    this.swap(i, right - 1)
    // 分而治之
    this.quick(left, i - 1)
    this.quick(i + 1, right)
}
ArrayList.prototype.quickSort = function () {
    this.quick(0, this.array.length - 1)
}


let list = new ArrayList()
list.insert(67)
list.insert(23)
list.insert(89)
list.insert(239)
list.insert(11)

list.quickSort()
console.log(list.toString())