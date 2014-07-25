
/**

	typeof和instanceof的用法
		typeof(x): 
			用途：判断一个变量的类型：基本类型还是对象
			
			未定义(var a;或者a未声明):  "undefined"
			                     数字:  "number"
			                   字符串:  "string"
			                   布尔值:  "boolean"
			          对象,数组和null:  "object"
			                     函数:  "function"
			
		instanceof:
			用途：判断一个变量是否某个类或者子类的实例
			实质：instanceof检查对象的[[prototype]] chain
			      a instanceof B，查看对象B的prototype对象是否在对象a的[[prototype]]链上
				  
 */
 

/**

	 判断一个变量的类型
	 
	//1、d是否为null
	d == null;

	//2、判断typeof d的值
	typeof d;

	//3、typeof d为object，进而判断是否为某个类或者子类的实例，但不判断具体的类型
	typeof d == 'object' && d instanceof Object; //true
	typeof d == 'object' && d instanceof Date; //true

	//判断具体类型
	typeof d == 'object' && d.constructor == Object; //false
	typeof d == 'object' && d.constructor == Date; //true
	
	//利用toString来判断
	Object.prototype.toString.call(d);
	[object Number]
	[object Boolean]
	[object String]
	[object Undefined]
	[object Null]
	
	[object Object]
	[object Array]
	[object Date]
	[object Function]
	[object RegExp]
	[object Error]

*/
 

 
 
//---------- 测试instanceof和typeof -----------

var d = new Date();
log('typeof d: ' + (typeof d)); //object
log('d instanceof Object: ' + (d instanceof Object)); //true
log('d instanceof Date: ' + (d instanceof Date)); //true
log('d.constructor == Object: ' + (d.constructor == Object)); //false
log('d.constructor == Date: ' + (d.constructor == Date)); //true
log('typeof d == "object" && d.constructor == Date: ' + (typeof d == "object" && d.constructor == Date)); //true
log('toString(d): ' + (Object.prototype.toString.call(d))); //[object Date]




