#!/usr/bin/env node
let os = require('os')
let fs = require('fs')
let path = require('path')
let { promisify } = require('util')
let parser = require('./lib/ini.js')

let readFileAsync = promisify(fs.readFile)
let writeFileAsync = promisify(fs.writeFile)
let copyFileAsync = promisify(fs.copyFile)

let backuppath = path.resolve(__dirname, 'backup')
let isbackuppathexist = fs.existsSync(backuppath)
if (!isbackuppathexist) fs.mkdirSync(backuppath)

let targetpath = process.platform === `win32` ? `C:/Windows/System32/drivers/etc` : `/etc`
let hostfilepath = path.resolve(__dirname, `./hosts.ini`)
let targetfilepath = path.resolve(targetpath, `./hosts`)

let isconfigfileexist = fs.existsSync(hostfilepath)
if (!isconfigfileexist) fs.writeFileSync(hostfilepath, ``, { encoding: `utf-8` })

let border = `----------------------------------------`

let _keys = process.argv.slice(2) || []
let keys = Array.from(_keys.length ? new Set([`common`, ..._keys]) : [])

let type = n => Object.prototype.toString.call(n).toLowerCase().slice(8, -1)

let getjsonbykeys = (json, keys) => keys.map(key => key.split('.').reduce((json, key) => json[key], json))

let convertjsontohostformat = (json, hosts = [])  => {
  for (let key in json) {
    let item = json[key]
    switch (type(item)) {
    case 'string':
      hosts.push(`${key}  ${item}`)
      break
    case 'array':
      hosts.push(`${key} ${item.join(' ')}`)
      break
    case 'object':
      convertjsontohostformat(item, hosts)
      break
    }
  }
}

let promise = copyFileAsync(targetfilepath, path.resolve(backuppath, (new Date).toISOString().replace(/:/g, '.')))

promise = promise.then(() => readFileAsync(hostfilepath, { encoding: 'utf8' }))

promise = promise.then(text => getjsonbykeys(parser(text), keys))

promise = promise.then(jsons => {
  let hosts = []
  jsons.forEach(json => convertjsontohostformat(json, hosts))
  let string = hosts.join(os.EOL).trim()
  console.log(`${border}`)
  console.log(string.length ? string : `Empty!`)
  return string
})

promise = promise.then(text => writeFileAsync(targetfilepath, text, { encoding: 'utf8' }))

promise.then(() => console.log(`${border}`))

promise.catch(e => console.error(e))
