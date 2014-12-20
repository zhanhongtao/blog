chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.getSelected(function(tab){
    init( tab );
  });
});

var DEFAULT_GOTO_SITE_ADDRESS_TEMPLATE = 'http://www.so.com/s?ie=utf-8&shb=1&src=360sou_newhome&q={keywork}';

function updateURL( id, url ) {
  if ( id ) {
    chrome.tabs.update(id, {
      'url': url,
      'selected': true
    });  
  } else {
    chrome.tabs.create({
      'url': url,
      'selected': true
    })  
  }
}

function init(tab) {
  var id = tab.id, 
      url = tab.url;
  var regSo = /https?\:\/\/www\.so\.com/gi;
  var reg = /https?\:\/\/www\.(baidu|sogou)\.com/gi;
  var regSelect = /(query|wd)=\S+?\&/gi; 
  if(regSo.test(url)){
    return;
  }
  var keyword = '', tabid;
  if ( reg.test(url) ) {
    var b = url.match(regSelect)[0].replace(/(query|wd)=/g,'').replace('&','');
    tabid = id;
    keyword = b;
  }
  updateURL( tabid, DEFAULT_GOTO_SITE_ADDRESS_TEMPLATE.replace( /{keyword}/g, keyword );
}

