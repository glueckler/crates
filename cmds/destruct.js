/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const destiny = '~~hiscrates'

//
//
// helpers..
const isDirectory = source => fs.lstatSync(source).isDirectory()

// function to rm -rf
const deleteFolderRecursive = function(path) {
  if (path === '/') {
    console.log('lets not delete our computer..')
    return
  }
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

//
//
// destructure..
module.exports = args => {
  console.log(`\nstart destructuring crates into ${destiny}...\n...\n`)

  // flags
  const hi = args.hi

  const dir = path.resolve('./')
  const destinyPath = `${dir}/${destiny}`

  const readDir = fs.readdirSync(dir)
  const sourceDirs = readDir
    .filter(isDirectory)
    .filter(dirr => dirr[0] === '~' && dirr !== destiny)
  deleteFolderRecursive(destinyPath)
  fs.mkdirSync(destinyPath)

  // copy each file with name beginning after >>
  const copyFiles = dirr => {
    if (dirr === '~hi' && !hi) return // don't copy ~hi folder
    console.log(`\n\ndestructuring ${dirr}\n...\n\n`)
    const files = fs.readdirSync(`${dir}/${dirr}`)
    const destinySubPath = `${destinyPath}/${dirr.slice(1)}` // slice off the ~
    fs.mkdirSync(destinySubPath)
    files.forEach(file => {
      const rename = file.slice(file.indexOf('>>') + 2).trim()
      console.log(`touch.. ${rename}`)
      fs.copyFileSync(`${dir}/${dirr}/${file}`, `${destinySubPath}/${rename}`)
    })
  }
  if (sourceDirs.length === 0) {
    console.log(`couldn't find any source dirs (starting with '~')`)
  }
  // apply copyFiles to all sourceDirs
  sourceDirs.forEach(copyFiles)

  console.log(`\n\nall done!\n`)
}
