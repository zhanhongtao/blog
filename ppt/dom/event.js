
function addEvent( element, type, handler ) {
  if ( !handler.guid ) {
    handler.guid = ++addEvent.guid;
  }
  if ( !element.events ) {
    element.events = {};
  }
  var handlers = element.events[ type ];
  if ( !handlers ) {
    handlers = element.events[ type ] = {};
    if ( element['on' + type] ) {
      handlers[0] = element[ 'on' + type ];
    }
  }
  handlers[ handler.guid ] = handler;
  element[ 'on' + type ] = handleEvent;
}

addEvent.guid = 1;

function removeEvent( element, type, handler ) {
  if ( element.events && element.events[type] ) {
    delete element.events[type][ handler.guid ];
  }
}

function handlerEvent( event ) {
  var returnValue;
  // @todo.
  event = event || fixEvent( event );
  var handlers = this.events[ event.type ];
  for ( var key in handlers ) {
    if ( handlers[key].call( this, event ) === false ) {
      returnValue = false;
    }
  }
  return returnValue;
}

function fixEvent( event ) {
  event.preventDefault = function() {
    this.returnValue = false;
  };
  event.stopPropagation = function() {
    this.cancelBubble = true;
  };
}
