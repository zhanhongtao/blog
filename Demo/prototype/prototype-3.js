
/**
 *  继承：通过创建中间原型对象，使得子类只继承父类原型中的方法和属性，不继承父类实例属性
 */
 

 
 
/**
 * @method extend
 * @description 实现子类继承父类
 * @param subClass {Function} 子类构造函数
 * @param superClass {Function} 父类构造函数
 */
function extend(subClass, superClass) {
	var F = function() {};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
}


// Person constructor
function Person(name, age) {
	this.name = name;
	this.age = age;
};

Person.prototype.say = function() {
	log('Call Person.prototype.say');
}

Person.prototype.eat = function() {
	log('Call Person.prototype.eat');
}


// FE constructor
function FE(name, age, level) {
	// 借用父类构造函数，继承父类属性（初始化属性）
	//Person.call(this, name, age);
	Person.apply(this, arguments);
	this.level = level;
}

// FE extend Person
extend(FE, Person);

FE.prototype.say = function() {
	log('Call FE.prototype.say');
}

FE.prototype.coding = function() {
	log('Call FE.prototype.coding');
}


// create FE instance
log('/** Create fe */');
var fe = new FE('Bob', 28, 'junior');
log('// call fe method');
fe.eat();
fe.say();
fe.coding();

log('// test instanceof');
testInstanceOf(fe, 'fe', 'FE');

log('// test constructor');
log('fe.constructor == FE: ' + (fe.constructor == FE));
log('fe.constructor == Person: ' + (fe.constructor == Person));


/**

结论：
	1、通过FE.prototype = new Person()，使得子类原型对象链中包含父类的原型对象，我们达到了继承父类原型方法的目的，
	   并且符合子类实例和父类之间的继承关系(符合instanceof判断规则)；
	2、子类通过借用父类构造函数来实例化属性；
	3、通过FE.prototype.constructor = FE来修正子类原型对象的constructor；
	4、通过创建中间原型对象，使得子类只继承父类原型中的方法和属性，不继承父类实例属性；
	5、在子类原型中定义的方法，会屏蔽父类原型中的同名方法。
	
*/