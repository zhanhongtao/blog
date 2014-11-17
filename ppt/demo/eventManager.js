(function(){
  var nextGuid = 1;
  this.addEvent = function (elem, type, fn) {
    var data = getData(elem);
    if ( !data.handlers ) data.handlers = {};
    if ( !data.handlers[type] ) {
      data.handlers[type] = [];
    }
    if ( !fn.guid ) fn.guid = nextGuid++;
    data.handlers[type].push(fn);
    if (!data.dispatcher) {
      data.disabled = false;
      data.dispatcher = function (event) {
        if (data.disabled) return;
        event = fixEvent(event);
        var handlers = data.handlers[event.type];
        if (handlers) {
          for (var n = 0; n < handlers.length; n++) {
            handlers[n].call(elem, event);
          }
        }
      };
    }
    if (data.handlers[type].length == 1) {
      if (document.addEventListener) {
        elem.addEventListener(type, data.dispatcher, false);
      }
      else if (document.attachEvent) {
        elem.attachEvent("on" + type, data.dispatcher);
      }
    }
  };
})();