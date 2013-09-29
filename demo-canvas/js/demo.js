  ;(function() {

    var canvas = new fabric.Canvas('c');
    var body = document.querySelector( 'body' );

    // 远程图片.
    var imgsrc = 'http://localhost:4324/11.jpg';
    fabric.Image.fromURL( imgsrc, function( oImg ) {
      oImg.set( 'originX', 'left' );
      oImg.set( 'originY', 'top' );
      console.log( oImg, oImg.width, oImg.height );
      canvas.add( oImg );
    });

    // 本地图片.
    function addLocalImage( src ) {
      var image = document.createElement( 'image' );
      image.src = src;
      image.style.display = 'block';
      body.appendChild( image );
      var imgInstance = new fabric.Image(image, {
        left: 100,
        top: 100,
        angle: 30,
        opacity: 0.85
      });
      canvas.add(imgInstance);
    }

    var uploadImage = document.querySelector( '#newimage' );
    uploadImage.addEventListener( 'change', function( event ) {
      var file = this.files[0];
      if ( file ) {
        var url = window.URL.createObjectURL( file );
        addLocalImage( url );
      }
    }, false );

    // 文本信息.

  })();