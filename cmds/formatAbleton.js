/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
//
// helper functions..
//
String.prototype.splice = function(idx, rem = 0, str = '') {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
}
const isDirectory = source => fs.lstatSync(source).isDirectory()
const isNotDirectory = source => !fs.lstatSync(source).isDirectory()

//
// main functionality
//
module.exports = args => {
  console.log(`formatting mixed in key files for ableton\n`)

  const formatMIK = dirr => {
    // recursively dive into directories
    const readDir = fs.readdirSync(dirr)
    readDir.forEach(file => {
      if (isDirectory(`${dirr}/${file}`)) formatMIK(`${dirr}/${file}`)
      let fileName = file
      // replace the 'or 5A' when there are multiple keys
      const noOrKey = fileName.replace(/\sor\s\d\d?[AB]/, '')
      if (noOrKey !== file) {
        console.log(`replacing ${file}\nwith      ${noOrKey}\n`)
        fs.renameSync(`${dirr}/${file}`, `${dirr}/${noOrKey}`)
        fileName = noOrKey
      }

      // test to see if file looks like mixed in key
      const fileNameTest = /^\d{2,3}\s-\s\d{1,2}[AB]\s-\s/.exec(fileName)
      // fileNameTest looks something like this
      // [ '70 - 5A - ',
      // index: 0,
      // input: '70 - 5A - 42 The Widdler - Eskimo Season' ]
      if (fileNameTest) {
        const prevFileName = fileName

        // first replace any numbers if necessary
        fileName = (() => {
          const mixStr = fileNameTest[0]
          let origin = fileName.slice(mixStr.length)
          origin = origin.replace(/^\d{1,2}\s/, '')
          return `${mixStr}${origin}`
        })()

        // replace the first few white spaces with ''
        for (let count = 0; count <= 3; count++) {
          fileName = fileName.splice(fileName.indexOf(' '), 1)
        }
        console.log(`replacing ${prevFileName}\nwith      ${fileName}\n`)
        fs.renameSync(`${dirr}/${prevFileName}`, `${dirr}/${fileName}`)
      }
    })
  }

  const dir = path.resolve('./')
  formatMIK(dir)

  console.log(`done :)\n`)
}
