/* eslint-disable no-console */
const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  let cmd = args._[0]

  if (args.h || args.help) {
    cmd = 'help'
  }
  if (args.d || args.destruct) {
    cmd = 'destruct'
  }
  if (args.f || args.format) {
    cmd = 'formatMIK'
  }
  if (args.ableton) {
    cmd = 'formatAbleton'
  }
  switch (cmd) {
    case 'help': {
      console.log(`\n--hi -> will create a folder with all structured songs\n`)
      console.log(
        `--clean or -c -> will delete files in source directories after copying\n`
      )
      console.log(
        `--normalize or -n -> will allow normalizing of directories which have nested directories`
      )
      console.log(`\n-d -> will destructure crates`)
      console.log(
        `  optional --hi flag will also destructure ~hi folder if it exists`
      )
      console.log(
        `  note! that any songs you wish to destructure must be inside a '~' directory (or they will go unnoticed)\n`
      )
      console.log(
        `--format or -f -> will format the Mixed in Key part of the filename\n\tie. 068-04A-SONG NAME\n`
      )
      console.log(
        `--ableton -> will format the Mixed in Key part of the filename for ableton\n\tie. 68-4A-SONG NAME`
      )
      break
    }
    case 'destruct':
      require('./cmds/destruct')(args)
      break
    case 'formatMIK':
      require('./cmds/formatMIK')(args)
      break
    case 'formatAbleton':
      require('./cmds/formatAbleton')(args)
      break
    default:
      require('./cmds/default')(args)
      break
  }
}
