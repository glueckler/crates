/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

//
// helper functions..
//

const isDirectory = source => fs.lstatSync(source).isDirectory()

const flattenDir = (dir, nested) => {
  const isDirectoryy = name => isDirectory(`${dir}/${name}`)
  const dirs = fs.readdirSync(dir).filter(isDirectoryy)
  dirs.forEach(dirr => {
    flattenDir(`${dir}/${dirr}`, true)
  })
  const files = fs.readdirSync(dir).filter(file => {
    return !isDirectoryy(file)
  })
  if (nested) {
    files.forEach(file => {
      fs.renameSync(`${dir}/${file}`, `${dir}/../${file}`)
    })
  }
  dirs.forEach(dirr => {
    fs.rmdirSync(`${dir}/${dirr}`)
  })
}

// callback to check the file name to see if it matches any that already exist
const compareFileNames = file => fileName => {
  return fileName.includes(file.slice(file.indexOf('>> ')))
}

const listDirectory = sourceDir => {
  return fs.readdirSync(sourceDir).filter(name => !/^\./.test(name))
}

//
// main functionality
//

module.exports = args => {
  console.log(`workin you some crates..\n`)

  // flags..
  let hi = args.hi

  const dir = path.resolve('./')
  const readDir = fs.readdirSync(dir)

  // for each directory that doesn't begin with ~ (and all hidden directories)
  // get the directory name
  const sourceDirs = readDir
    .filter(name => !/^~|^\./.test(name))
    .filter(isDirectory)

  const targetDirs = readDir.filter(name => /^~/.test(name)).filter(isDirectory)

  //
  //
  //
  // loop through each file in the directory and rename the files
  //
  const processDirFiles = sourceDir => {
    // clean up directory
    flattenDir(`${dir}/${sourceDir}`)

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
  console.log(`cleaning and renaming files in..\n${sourceDirs}\n...`)
  sourceDirs.forEach(processDirFiles)
  console.log(`next..\n`)

  //
  //
  //
  // loop through the files again and write the file in the directory ./~hi (create directory if it doens't exist)
  //
  const writeNewFiles = sourceDir => {
    const files = listDirectory(sourceDir)
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
      // check the file name to see if it matches any that already exist
      const fileExistsInTarget = targetDirFiles.find(compareFileNames(file))
      if (!fileExistsInTarget) {
        fs.copyFileSync(
          `${dir}/${sourceDir}/${file}`,
          `${dir}/${targetDirName}/${file}`
        )
      }

      // delete the file source file (try catch for system files)
      try {
        fs.unlinkSync(`${dir}/${sourceDir}/${file}`)
      } catch (err) {
        console.log(`! error deleting original file\n${err}`)
      }
    })
  }
  console.log(`copy files in..\n${sourceDirs}\nif they're are any..\n...`)
  sourceDirs.forEach(writeNewFiles)
  console.log(`next..\n`)

  if (hi) {
    console.log(`CREATING: ~hi master folder for all music..\n...`)

    // if ~hi dir doesn't exist create it..
    if (!readDir.includes('~hi') && hi) {
      fs.mkdirSync(`${dir}/~hi`)
    }

    const newTargetDirs = fs
      .readdirSync(dir)
      .filter(name => /^~/.test(name))
      .filter(isDirectory)

    newTargetDirs.forEach(targetDir => {
      const files = listDirectory(targetDir)
      files.forEach(file => {
        // write the file in the dir ./~hi-<dirname> (create if it doens't exist)
        const fileExistsInhi = fs
          .readdirSync(`${dir}/~hi`)
          .find(compareFileNames(file))
        if (!fileExistsInhi) {
          fs.copyFileSync(`${dir}/${targetDir}/${file}`, `${dir}/~hi/${file}`)
        }
      })
    })
    console.log(`next..\n `)
  }

  console.log(`done :)`)
}
