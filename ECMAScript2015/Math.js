// 扩展 Math 对象.

// 表示移除小数部分, 返回整数
Math.trunc(1.5); // 1
Math.trunc('1.2'); // 1
Math.trunc(NaN); // NaN
Math.trunc('a'); // NaN

// 用来判断正负数
Math.sign(8);   // +1;
Math.sign(-8);  // -1;
Math.sign(0);   // 0;
Math.sign(NaN); // NaN;
Math.sign('a'); // NaN;

// 计算立方根
Math.cbrt(1); // 1
Math.cbrt(125); // /5;
Math.cbrt(8); // 2;
Math.cbrt('a'); // NaN

// 计数, 整数的 32 位无符号表示, 前导零的个数
Math.clz32(0); // 32
Math.clz32(1); // 31
// 只考虑整数部分
Math.clz32(1.1); // 31
// 空值/其他类型值, 会先转换为数值.
Math.clz32([]); // 31
Math.clz32({}); // 32

// 返回所有参数的平方和的平方根
Math.hypot(3, 4); // 5
Math.hypot(1, 'a'); // NaN

Math.imul()
Math.fround()

// 添加指数运算符
2 ** 3; // 8
// 相当于
Math.pow(2, 3); // 2^3 -> 8
