/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

//
// helper functions..
//

const isDirectory = source => fs.lstatSync(source).isDirectory()
const isNotDirectory = source => !fs.lstatSync(source).isDirectory()
String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
}
//
// main functionality
//

module.exports = args => {
  console.log(`cleaning up Mixed in Key..\n`)

  const dir = path.resolve('./')
  const readDir = fs.readdirSync(dir)
  const files = readDir.filter(isNotDirectory)

  console.log(`replacing all instances of multiple keys ex. 'or 5A' \n...\n`)
  files.forEach(file => {
    // replace the 'or 5A' when there are multiple keys
    let fileName = file
    if (/^\d{2}\s/.test(fileName)) {
      fileName = `0${fileName}`
    }
    if (/^\d{3}\s-\s\d{1}[AB]/.test(fileName)) {
      fileName = fileName.splice(6,0,'0')
    }
    const noOrKey = fileName.replace(/\sor\s\d\d?[AB]/, '')
    if (noOrKey !== file) {
      console.log(`replacing ${file}\nwith      ${noOrKey}\n`)
      fs.renameSync(`${dir}/${file}`, `${dir}/${noOrKey}`)
    }
  })

  console.log(`done :)\n`)
}
