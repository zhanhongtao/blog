function cloest( element, target ) {
    while ( element && element.nodeType === 1 ) {
        if ( element.webkitMatchesSelector(target) ) {
            return element;
        }
        element = element.parentNode;
    }
    return null;
}

function cloest( element, target ) {
  if ( !element ) {
    return element;
  }
  if ( element.webkitMatchesSelector(target) ) {
    return element;
  }
  return cloest( element.parentNode, target );
}