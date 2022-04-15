/////
///// 对象原理
///// 
/**
 * new
 * @param {Function} fn 
 * @param {Array} args 
 */
function _new(fn, args) {
    if (typeof fn !== 'function') {
        throw TypeError('fn is not function')
    }
    let obj = new Object()
    obj.__proto__ = fn.prototype
    let res = fn.apply(obj, args)
    return typeof res == 'object' ? res : obj
}


/**
 * Object.create
 * @param {Object} obj 
 */
Object._create = function (obj) {
    function Fn() { }
    Fn.prototype = obj
    return new Fn()
}


/**
 * instanceof
 * @param {Object} left 
 * @param {Object} right 
 */
function _instanceof(left, right) {
    let proto = Object.getPrototypeOf(left)
    prototype = right.prototype
    while (proto) {
        if (proto === prototype) {
            return true
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false
}

/**
 * typeof
 * @param {any} value 
 */
function _typeOf(obj) {
    let type = typeof obj
    if (type !== 'object') return type
    // slice 参数为负数则返回从后向前的数组
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

/**
 * 深浅拷贝
 * @param {*} obj 
 * @param {*} deep 
 * @returns 
 */
function objectCopy(obj, deep = false) {
    if (typeof obj !== 'object') return obj
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let element = obj[key]
            newObj[key] = deep && typeof element === 'object' ? objectCopy(element, deep) : element
        }
    }
    return newObj
}



/////
///// 面向对象
/////
/**
 * 创建对象
 */
// 1. 工厂模式
function createPerson(name, age, job) {
    let person = new Object();
    person.name = name;
    person.age = age;
    person.job = job;
    person.sayNam = function () {
        console.log(`I'm ${name}`);
    };
    return person;

}
const person1 = createPerson('Gray', 25, 'Doctor');

// 2. 构造函数模式
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        console.log(this.name);
    }
}
const person2 = new Person('Gray', 25, 'Doctor');

// 3. 原型模式
function Person() { }
Person.prototype.name = 'Uzi';
Person.prototype.age = 22;
Person.prototype.job = 'E-Sports Player';
Person.prototype.sayName = function () {
    console.log(this.name);
}
const person3 = new Person();

// 4. 组合使用构造函数模式和原型模式
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ['Amy', 'Ben'];
}
Person.prototype = {
    constructor: Person,
    sayName: function () {
        console.log(this.name);
    }
}
const person4 = new Person('Uzi', 22, 'Software Engineer');

// 5. 动态原型模式
function Person(name, age, job) {
    // 属性
    this.name = name;
    this.age = age;
    this.job = job;
    // 方法（动态插入原型方法）
    if (typeof this.sayName != 'function') {
        Person.prototype.sayName = function () {
            console.log(`I'm ${this.name}`);
        }
    }
}
const person5 = new Person('Uzi', 2, 'E-Sports Player');

// 6. 寄生构造函数模式（不推荐）
function Person(name, age, job) {
    let obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.job = job;
    obj.sayName = function () {
        console.log(`I'm ${this.name}`);
    };
    return obj;
}
let person6 = new Person('Uzi', 22, 'E-Sports Player');

// 7. 稳妥构造函数模式（不推荐）
function Person(name, age, job) {
    // 创建要返回的对象
    const obj = new Object();
    // 可以在这里定义私有变量和函数
    // 添加方法
    obj.sayName = function () {
        console.log(name);
    };
    // 返回对象
    return obj;
}
let uzi = Person('Uzi', 22, 'E-Sports Player');


/**
 * 继承对象
 */
// 1. 原型链
function Parent() {
    this.attr = {
        eye: 'blue',
        hair: 'black',
        skin: 'white',
    };
    this.sayName = function () {
        console.log('Name');
    };
}
function Child() {
    this.sayHi = function () {
        console.log('Hello world!');
    };
}
Child.prototype = new Parent()

// 2. 借用构造函数
function Parent(name) {
    this.name = name;
}
function Child() {
    //继承了 Parent，同时还传递了参数
    Parent.call(this, 'Uzi');
    //实例属性
    this.age = 18;
}

// 3. 组合继承
function Parent(name) {
    this.name = name;
    this.attr = {
        eye: 'blue',
        hair: 'black',
        skin: 'white',
    };
}
Parent.prototype.sayName = function () {
    console.log(this.name);
};
function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child; // constructor指向问题
Child.prototype.sayAge = function () {
    console.log(this.age);
};

// 4. 原型式继承（Object.create()原理）
function Person(friendship) {
    function Creator() { }
    Creator.prototype = friendship;
    return new Creator();
}

// 5. 寄生式继承
function creator(origin) {
    let clone = Object.create(origin);
    clone.sayHi = function () {
        console.log('Hello world!');
    };
    return clone;
}

// 6. 寄生组合式继承（首选）
function inherit(children, parent) {
    // 创建对象
    let prototype = Object.create(parent.prototype);
    // 增强对象
    prototype.constructor = children;
    // 指定对象
    children.prototype = prototype;
}
function Parent(name) {
    this.name = name;
    this.num = [0, 1, 2];
}
Parent.prototype.sayName = function () {
    alert(this.name);
};
function Child(name, age) {
    // 父类自身属性继承
    Parent.call(this, name);
    this.age = age;
}
inherit(Child, Parent);


/////
///// 其它方面
///// 
/**
 * 对象是否循环使用
 * @param {Object} obj 
 * @param {Object} parent 
 */
const isCycleObject = (obj, parent) => {
    const parentArr = parent || [obj];
    for (let i in obj) {
        if (typeof obj[i] === 'object') {
            let flag = false;
            parentArr.forEach((pObj) => {
                if (pObj === obj[i]) {
                    flag = true;
                }
            })
            if (flag) return true;
            flag = isCycleObject(obj[i], [...parentArr, obj[i]]);
            if (flag) return true;
        }
    }
    return false;
}
