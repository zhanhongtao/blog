$.upload = function upload(api, name, file) {
  var defer = $.Deferred();
  var form = new FormData();
  form.append(name, file);
  $.ajax({
    url: api,
    method: 'POST',
    dataType: 'json',
    processData: false,
    contentType: false,
    data: form,
    xhr: function() {
      var xhr = jQuery.ajaxSettings.xhr();
      if (xhr.upload) {
        xhr.upload.addEventListener('loadstart', function() {
          defer.notify({
            type: 'loadstart'
          });
        });
        xhr.upload.addEventListener('progress', function(event) {
          var percent = 0;
          var position = event.loaded;
          var total = event.total;
          if (event.lengthComputable) {
            percent = Math.ceil(position / total * 100);
          }
          defer.notify({
            type: 'progress',
            position: position,
            total: position,
            percent: percent
          });
        }, false);
        xhr.upload.addEventListener('load', function() {
          defer.notify({
            type: 'load'
          });
        });
        xhr.upload.addEventListener('error', function(e) {
          defer.notify({
            type: 'error'
          });
          console.log('upload.error:', e);
        });
        xhr.upload.addEventListener('loadend', function() {
          defer.notify({
            type: 'loadend'
          });
        });
        xhr.upload.addEventListener('abort', function() {
          defer.notify({
            type: 'abort'
          });
        });
        xhr.upload.addEventListener('timeout', function() {
          defer.notify({
            type: 'timeout'
          });
        });
      }
      return xhr;
    }
  }).done(function(response) {
    if (response.code == 0) {
      defer.resolve(response.data);
    } else {
      defer.reject(response.msg);
    }
  }).fail(function(xhr, status) {
    defer.reject(status);
  });
  return defer;
}
