



if (!window.console) {
	window.console = {
		log: function () {}
	};
}

window.debug = {
	isdebug: function (flag) {
		this.debug = !!flag;
	},
	log: function () {
		if (!!this.debug) {
			console.log.apply(console, argument);
		}
	}
};



