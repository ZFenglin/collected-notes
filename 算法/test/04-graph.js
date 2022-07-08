function Queue() { this.items = [] }
Queue.prototype.enqueue = function (element) { return this.items.push(element) }
Queue.prototype.dequeue = function () { return this.items.shift() }
Queue.prototype.front = function () { return this.items[0] }
Queue.prototype.isEmpty = function () { return this.items.length === 0 }
Queue.prototype.size = function () { return this.items.length }
Queue.prototype.toString = function () { return this.items.join(',') }

function Graph() {
    // 顶点
    this.vertexes = []
    this.edges = new Map()

    // 方法
    // 添加顶点
    Graph.prototype.addVertex = function (v) {
        this.vertexes.push(v)
        this.edges.set(v, [])
    }
    // 添加边
    Graph.prototype.addEdges = function (v1, v2) {
        this.edges.get(v1).push(v2)
        // 无向图
        this.edges.get(v2).push(v1)
    }
    // 打印
    Graph.prototype.toString = function () {
        let str = ''
        for (let i = 0; i < this.vertexes.length; i++) {
            str += this.vertexes[i] + '=>'
            str += this.edges.get(this.vertexes[i]).join('') + ' '
        }
        return str
    }
    // 初始化颜色状态
    Graph.prototype.initializeColor = function () {
        let colors = {}
        for (let i = 0; i < this.vertexes.length; i++) {
            colors[this.vertexes[i]] = 'white'
        }
        return colors
    }
    // 广度优先搜索
    Graph.prototype.bfs = function (initV, handler) {
        var colors = this.initializeColor()
        var queue = new Queue()
        queue.enqueue(initV)
        while (!queue.isEmpty()) {
            var v = queue.dequeue()
            var vList = this.edges.get(v)
            colors[v] = 'grey'
            for (let i = 0; i < vList.length; i++) {
                var e = vList[i]
                if (colors[e] === 'white') {
                    colors[e] = 'grey'
                    queue.enqueue(e)
                }
            }
            handler(v)
            colors[v] = 'black'
        }
    }
    // 深度优先搜索
    Graph.prototype.dfs = function (initV, handler) {
        var colors = this.initializeColor()
        this._dfsVisit(initV, colors, handler)
    }
    Graph.prototype._dfsVisit = function (v, colors, handler) {
        colors[v] = 'gray'
        handler(v)
        var vList = this.edges.get(v)
        for (let i = 0; i < vList.length; i++) {
            const e = vList[i];
            if (colors[e] === 'white') {
                this._dfsVisit(e, colors, handler)
            }
        }
        colors[v] = 'black'
    }
}


let g = new Graph()

var vertexes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

for (let i = 0; i < vertexes.length; i++) {
    g.addVertex(vertexes[i])
}

g.addEdges('A', 'B')
g.addEdges('A', 'C')
g.addEdges('A', 'D')
g.addEdges('C', 'D')
g.addEdges('C', 'G')
g.addEdges('D', 'G')
g.addEdges('D', 'H')
g.addEdges('B', 'E')
g.addEdges('B', 'F')
g.addEdges('E', 'I')

// console.log(g.toString())

g.dfs(g.vertexes[0], function (v) { console.log(v) })