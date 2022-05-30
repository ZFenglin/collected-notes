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
    // 初始化增量设置
    let gap = Math.floor(length / 2)
    // while循环处理，同时gap缩小
    while (gap >= 1) {
        // gap分割列表，并按照插入排序处理
        for (let i = gap; i < length; i++) {
            let temp = this.array[i]
            let j = i
            while (this.array[j - gap] > temp && j > gap - 1) {
                this.array[j] = this.array[j - gap]
                j -= gap
            }
            // 将j位置的元素赋值给temp
            this.array[j] = temp
        }
        // gap更新
        gap = Math.floor(gap / 2)
    }
}


let list = new ArrayList()
list.insert(239)
list.insert(89)
list.insert(67)
list.insert(23)
list.insert(11)

list.shellSort()
console.log(list.toString())