$.download = function(options){
	var list = [];
	$( options.selectors ).filter(function(index){
		if(options.filter){
			return options.filter(index);
		}
		return true;
	}).each(function(index, selector){
		$(selector).each(function(index, item){
			var array = [];
			$( options.attr ).each(function(index, attr){
				var value = '';
				if(typeof attr == 'function'){
					value = attr(item);
				}else if(attr == 'text'){
					value = $(item).text();
				}else{
					value = $(item).attr(attr);
				}
				array.push(value);
			})
			if(options.test(array,function(attr){
		    		list.push([attr,$(item).text()]);
		    	})
			){
				options.percallback(item);
			}
		});
	});
	options.callback(list);
}
$.download({
	'selectors':['a','div'],
	'attr':['href','text','src',function(dom){
		return $(dom).data('href');
	}],
	'test':function(array,cb){
		var reg =  /\.(exe|pdf|zip|rar)$/i;
		for(var i = 0, l = array.length; i < l ; ++i){
		 	if(reg.test(array[i])){
		 		cb && cb(array[i]);
				return true;
			}
		}
        return false;
	},
	'percallback':function(dom){
		$(dom).css( 'color', 'red' );
	},
	'callback':function(list){
		console.log(list);
	}
})