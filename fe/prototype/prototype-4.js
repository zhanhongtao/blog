
/**
 *  继承：多个子类
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


// QA constructor
function QA(name, age, level) {
	Person.apply(this, arguments);
	this.level = level;
}

// QA extend Person
extend(QA, Person);

QA.prototype.testing = function() {
	log('Call QA.prototype.testing');
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


// create QA instance
log('<br />/** Create qa */');
var qa = new QA('Jim', 32, 'senior');
log('// call qa method');
qa.eat();
qa.say();
qa.testing();
log('// test instanceof');
testInstanceOf(qa, 'qa', 'QA');

log('// test constructor');
log('fe.constructor == FE: ' + (fe.constructor == FE));
log('qa.constructor == QA: ' + (qa.constructor == QA));

