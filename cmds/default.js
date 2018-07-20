const path = require('path')
const fs = require('fs')

const isDirectory = source => fs.lstatSync(source).isDirectory()

module.exports = args => {
  const dir = path.resolve('./')
  const readDir = fs.readdirSync(dir)

  // for each directory that doesn't begin with ~ (and all hidden directories)
  // get the directory name
  const sourceDirs = readDir
    .filter(name => !/^\~|^\./.test(name))
    .filter(isDirectory)

  const targetDirs = readDir
    .filter(name => /^\~/.test(name))
    .filter(isDirectory)

  // if ~hi dir doesn't exist create it..
  if (!readDir.includes('~hi')) {
    fs.mkdirSync(`${dir}/~hi`)
  }

  // loop through each file in the directory and rename the files
  const processDirFiles = sourceDir => {
    // get file names and filter out hidden files
    const files = fs.readdirSync(sourceDir).filter(name => {
      return !/^\./.test(name)
    })

    files.forEach(file => {
      let newName = file
      // if the filename starts with a single or double digit number followed by a space.. delete the number
      if (/^\d\d\s/.test(file)) {
        newName = file.substr(-(file.length - 3))
      } else if (/^\d\s/.test(file)) {
        newName = file.substr(-(file.length - 2))
      }
      // rename the file <dirName> >> <originalFilename>
      newName = `~${sourceDir} >> ${newName}`

      // rename the file
      fs.renameSync(`${sourceDir}/${file}`, `${sourceDir}/${newName}`)
    })
  }
  sourceDirs.forEach(processDirFiles)

  // loop throught the files again and write the file in the directory ./~hi (create directory if it doens't exist)
  const writeNewFiles = sourceDir => {
    const files = fs.readdirSync(sourceDir).filter(name => !/^\./.test(name))
    // return if there are no files to process..
    if (files.length === 0) return null

    const targetDirName = `~${sourceDir}`
    const targetDirExists = targetDirs.includes(targetDirName)
    if (!targetDirExists) {
      fs.mkdirSync(`${dir}/${targetDirName}`)
    }
    // make list of all files in the target dir
    const targetDirFiles = fs.readdirSync(`${dir}/${targetDirName}`)

    files.forEach(file => {
      // callback to check the file name to see if it matches any that already exist
      const compareFileNames = fileName => {
        return fileName.includes(file.slice(file.indexOf('>> ')))
      }
      // check the file name to see if it matches any that already exist
      const fileExistsInTarget = targetDirFiles.find(compareFileNames)
      if (!fileExistsInTarget) {
        fs.copyFileSync(
          `${dir}/${sourceDir}/${file}`,
          `${dir}/${targetDirName}/${file}`
        )
      }

      // write the file in the dir ./~hi-<dirname> (create if it doens't exist)
      const fileExistsInhi = fs.readdirSync(`${dir}/~hi`).find(compareFileNames)
      if (!fileExistsInhi) {
        fs.copyFileSync(`${dir}/${sourceDir}/${file}`, `${dir}/~hi/${file}`)
      }
      // delte the file source file
      fs.unlinkSync(`${dir}/${sourceDir}/${file}`)
    })
  }
  sourceDirs.forEach(writeNewFiles)
}
