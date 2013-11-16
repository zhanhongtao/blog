



function start() {
	var fieldsets = document.getElementsByTagName('fieldset');
	var i = 0;
	var num = fieldsets.length;
	for (; i < num; i++) {
		testFieldset(fieldsets[i]);
	}

	var legends = document.getElementsByTagName('legend');
	for (i = 0, num = legends.length; i < num; i++) {
		testLegend(legends[i]);
	}
}

function testFieldset(item) {
	var items = ['disabled', 'form', 'name', 'type', 'elements'];
	var ret = [];
	var i = 0, len = items.length, key;
	for (; i < len; i++) {
		key = items[i];
		ret.push(item[key]);
	}
	console.group.apply(console, ret);
}

function testLegend(item) {
	console.group.call(console, '#', item.form);
}



start();



