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


let list = new ArrayList()
list.insert(239)
list.insert(89)
list.insert(67)
list.insert(23)
list.insert(11)

list.selectionSort()
console.log(list.toString())