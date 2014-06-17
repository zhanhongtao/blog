
/**
 *  函数、构造函数、原型
 *  类 类属性 实例 实例属性
 */
 
 
 

//构造函数
function Person(name, age) {
	//this初始化实例属性和方法
	this.name = name;
	this.age = age;
	this.say = function() {
		log('Call Person instance say');
	}
};

//添加类属性和类方法
Person.MaxAge = '200';
Person.eat = function() {
	log('Call Person.eat');
}


//添加原型属性和原型方法
Person.prototype.age = '50';
Person.prototype.walk = function() {
	log('Call Person.prototype.walk');
}


//创建Person实例
var p = new Person('Bob', 28);

//添加实例方法和属性
p.sex = 'male';
p.sleep = function() {
	log('Call p.sleep');
}

log('Person.MaxAge: ' + Person.MaxAge);
log('p.MaxAge: ' + p.MaxAge);
log('p.age: ' + p.age);
p.say();
p.walk();
p.sleep();
			