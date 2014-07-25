
/**
 *  ¼Ì³Ð£º»ùÓÚÔ­ÐÍÁ´µÄ¼Ì³Ð
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
	this.name = name;
	this.age = age;
	this.level = level;
}

//½¨Á¢×ÓÀàÔ­ÐÍ¶ÔÏóºÍ¸¸ÀàÔ­ÐÍ¶ÔÏóÖ®¼äµÄ¹ØÁª
FE.prototype = new Person();


// create FE instance
log('/** Create fe */');
var fe = new FE('Bob', 28, 'junior');
log('// call fe method');
fe.say();
fe.eat();

log('// test instanceof');
testInstanceOf(fe, 'fe', 'FE');

log('// test constructor');
log('fe.constructor == FE: ' + (fe.constructor == FE));
log('fe.constructor == Person: ' + (fe.constructor == Person));




/**

½áÂÛ£º
	1¡¢Í¨¹ýFE.prototype = new Person()£¬Ê¹µÃ×ÓÀàÔ­ÐÍ¶ÔÏóÁ´ÖÐ°üº¬¸¸ÀàµÄÔ­ÐÍ¶ÔÏó£¬ÎÒÃÇ´ïµ½ÁË¼Ì³Ð¸¸ÀàÔ­ÐÍ·½·¨µÄÄ¿µÄ£»
	   ²¢ÇÒ·ûºÏ×ÓÀàÊµÀýºÍ¸¸ÀàÖ®¼äµÄ¼Ì³Ð¹ØÏµ(·ûºÏinstanceofÅÐ¶Ï¹æÔò)¡£

ÎÊÌâ£º
	1¡¢´´½¨×ÓÀàÐÍÊµÀýÊ±£¬²»ÄÜÏò¸¸ÀàµÄ¹¹Ôìº¯ÊýÖÐ´«µÝ²ÎÊý£¬Ôì³É×ÓÀà²»ÄÜ½èÓÃ¸¸Àà¹¹Ôìº¯ÊýÀ´ÊµÀý»¯×Ô¼ºµÄÊôÐÔ£¬²úÉúºÃ¶àÈßÓà´úÂë£¬Ò²²»ÀûÓÚÎ¬»¤£»
	2¡¢fe.constructor£¨FE.prototype.constructor£©Ó¦¸ÃÊÇFE£¬¶ø²»ÊÇPerson£»
	3¡¢×ÓÀàÔ­ÐÍ¶ÔÏó£¨¼´¸¸ÀàÊµÀý£©ÖÐ°üº¬Ò»Ð©¸¸ÀàÊµÀýÊôÐÔ£¬ÎÒÃÇµÄÄ¿µÄÊÇ×ÓÀàÖ»¼Ì³Ð¸¸ÀàÔ­ÐÍÖÐµÄ·½·¨£¬²»¼Ì³Ð´´½¨Ô­ÐÍÊ±¸¸ÀàÊµÀýÊôÐÔ¡£

*/

			