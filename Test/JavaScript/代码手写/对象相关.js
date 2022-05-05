////////// 原理相关
/**
 * new实现
 * @param {function} fn 
 */
function _new(fn, ...args) {
    if (typeof fn !== 'function') {
        throw TypeError('fn is not function')
    }
    let obj = {}
    obj.__proto__ = fn.prototype
    let res = fn.apply(obj, args)
    return typeof res === 'object' ? res : obj
}
// 测试
function Preson(name) {
    this.name = name
}
Preson.prototype.sayName = function () {
    console.log('我是' + this.name)
}
let p1 = _new(Preson, 'zfl')
console.log(p1)
p1.sayName()
let p2 = new Preson('zfl')
console.log(p2)



/**
 * Object.create实现
 * @param {obj} obj 
 */
Object._create = function (obj) {
    if (typeof obj !== 'object') {
        throw TypeError('obj only be object or null')
    }
    function Fn() { }
    Fn.prototype = obj
    return new Fn()
}
// 测试
let obj = { name: 'zfl' }
let res1 = Object._create(obj)
let res2 = Object.create(obj)
console.log(res1, res2)



/**
 * instanceof实现
 * @param {*} left 
 * @param {*} right 
 */
function _instanceof(left, right) {
    let proto = Object.getPrototypeOf(left)
    const prototype = right.prototype
    while (proto) {
        if (proto === prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}
// 测试
function A() { }
const a = new A()
const b = {}
console.log(a instanceof A, b instanceof A)
console.log(a instanceof Object, b instanceof Function, A instanceof Function)
console.log(_instanceof(a, A), _instanceof(b, A))
console.log(_instanceof(a, Object), _instanceof(a, Function), _instanceof(A, Function))



/**
 * typeof实现
 * @param {*} val 
 */
function _typeOf(val) {
    if (val === null) return 'object'
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}
// 测试
console.log(_typeOf(null), typeof null)
console.log(_typeOf(undefined), typeof undefined)
console.log(_typeOf({}), typeof {})
console.log(_typeOf(1), typeof 1)
console.log(_typeOf('1'), typeof '1')
console.log(_typeOf(true), typeof true)
console.log(_typeOf(() => { }), typeof (() => { }))



////////// 面向对象-创建对象
// 1. 工厂模式
function createPerson(name) {
    let preson = {}
    preson.name = name
    preson.sayName = function () {
        console.log('我叫' + this.name)
    }
    return preson
}
let fp = createPerson('zfl')
console.log(fp) // {name: 'zfl', sayName: ƒ}

// 2. 构造函数模式
function Preson(name) {
    this.name = name
    this.sayName = function () {
        console.log('我叫' + this.name)
    }
}
let sp = new Preson('zfl')
console.log(sp) // Preson {name: 'zfl', sayName: ƒ}

// 3. 原型模式
function Preson() { }
Preson.prototype.name = 'zfl'
Preson.prototype.sayName = function () {
    console.log('我叫' + this.name)
}
let pp = new Preson('zfl')
console.log(pp) // Preson {} 属性在__proto__里面

// 4. 组合模式（最优解）
function Preson(name) {
    this.name = name
}
Preson.prototype.sayName = function () {
    console.log('我叫' + this.name)
}
let cp = new Preson('zfl')
console.log(cp) // Preson {name: 'zfl'} sayName在__proto__中

// 5. 动态原型
function Preson(name) {
    this.name = name
    if (typeof this.sayName !== 'function') {
        Preson.prototype.sayName = function () {
            console.log('我叫' + this.name)
        }
    }
}
let acp = new Preson('zfl')
console.log(acp) // 结果和组合模式一样

// 6. 寄生构造函数模式（只是工厂函数调用new）
let pfp = new createPerson('zfl')
console.log(pfp) // 但是返回值和工厂函数没区别

// 7. 稳妥构造函数
function secureCreatePerson(name) {
    let preson = {}
    preson.name = name
    preson.sayName = function () {
        console.log('我叫' + name) // 不使用this
    }
    return preson
}
let scp = secureCreatePerson('zfl') // 不使用new
console.log(scp)

////////// 面向对象-继承对象
function Preson(name) {
    this.name = name
}
Preson.prototype.sayName = function () {
    console.log('我叫' + this.name)
}

// 1. 原型链
function PrototypeChild(sex) {
    this.sex = sex
}
PrototypeChild.prototype = new Preson('zfl')
PrototypeChild.prototype.constructor = PrototypeChild
const pc = new PrototypeChild('man')
console.log(pc) // PrototypeChild {sex: 'man'} name与sayName在proto

// 2. 借用构造函数
function ConstructorChild(sex) {
    Preson.call(this, 'zfl')
    this.sex = sex
}
const cc = new ConstructorChild('man')
console.log(cc) // ConstructorChild {sex: 'man', name: 'zfl'}，但是sayName不存在

// 3. 组合继承
function PrototypeConstructorChild(sex) {
    Preson.call(this, 'zfl')
    this.sex = sex
}
PrototypeConstructorChild.prototype = new Preson('zfl')
PrototypeConstructorChild.prototype.constructor = PrototypeConstructorChild
const pcc = new PrototypeConstructorChild('man')
console.log(pcc) // PrototypeConstructorChild {name: 'zfl', sex: 'man'}，并且sayName也存在于原型上，但是有重复的name属性

// 4. 原型式继承(Object.create)
const p = new Preson('zfl')
function creator(prototype) {
    function Creator() { }
    Creator.prototype = prototype
    return new Creator()
}
const occ = creator(p)
console.log(occ)

// 5. 寄生式继承
function creator(origin) {
    let clone = Object.create(origin)
    clone.sex = 'man'
    return clone
}
const pac = creator(p)
console.log(pac)

// 6. 寄生式组合式继承（推荐）
function inherit(children, parent) {
    let prototype = Object.create(parent.prototype);
    prototype.constructor = children;
    children.prototype = prototype;
}
function ParasiticCompsitionChild(name, sex) {
    Preson.call(this, name)
    this.sex = sex
}
inherit(ParasiticCompsitionChild, Preson)
const pacc = new ParasiticCompsitionChild('zfl', 'man')
console.log(pacc)

