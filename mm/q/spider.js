/*
  https://www.zhenhunxiaoshuo.com/59055.html
*/

let fs = require('fs')
let path = require('path')
let dist = 'qianqiu'

let template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>

<link rel="stylesheet" href="base.css">

</head>


<body class="mac locale-zh-Hans sepia pingfangsc system">
  <div id="article">
  <div class="page">      

  __placeholder__

<div> </div>
    </div>
    </div>
</body>

</html>
`

function read(p, raw = '') {
  let filepath = path.resolve(__dirname, `./${ dist }/${ p }.html`)
  if (fs.existsSync(filepath) == false) {
    return todo(raw)
  }
  let html = fs.readFileSync(filepath, { encoding: 'utf-8' })
  raw += '\n' + html
  read(++p, raw)
}

function todo(raw) {
  let regexp = /.+(第.+?章|番外).+/g
  let h = `########`
  let fixedRawHTML = raw.replace(regexp, (_, m) => {
    return h + _
  })
  let list = fixedRawHTML.split(h)
  list.forEach((item, index) => {
    let html = template.replace('__placeholder__', item)
    fs.writeFileSync(`./dist/${ index }.html`, html, { encoding: 'utf-8' })
  })
}

read(1)
