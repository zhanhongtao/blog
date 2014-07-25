

//构造函数
function Person(name, age) {
	this.name = name;
	this.age = age;
};

//new加Person创建一个Person实例，this指向js引擎创建的一个对象，并返回这个对象
var p1 = new Person('Bob', 28);

//Person作为常规函数调用，this指向window，返回值undefined
var p2 = Person('Bob', 28);