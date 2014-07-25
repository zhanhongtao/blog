
/**
 *  继承：借用父类构造函继承属性
 *        修正子类原型的constructor属性值
 */

 
 

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

FE.prototype = new Person();
//修正FE和FE.prototype之间的引用关系
FE.prototype.constructor = FE;

//重写父类say方法
FE.prototype.say = function() {
	log('Call FE.prototype.say');
}

//新增coding方法
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
	3、通过FE.prototype.constructor = FE来修正子类原型对象的constructor。

问题：
	3、子类原型对象（即父类实例）中包含一些父类实例属性，我们的目的是子类只继承父类原型中的方法，不继承创建原型时父类实例属性。
	
*/	