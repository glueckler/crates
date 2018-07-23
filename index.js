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
  switch (cmd) {
    case 'help': {
      console.log(`\n--hi -> will create a folder with all structured songs`)
      console.log(
        `--clean or -c -> will delete files in source directories after copying`
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
        `--format or -f -> will format the Mixed in Key part of the filename\n`
      )
      break
    }
    case 'destruct':
      require('./cmds/destruct')(args)
      break
    case 'formatMIK':
      require('./cmds/formatMIK')(args)
      break
    default:
      require('./cmds/default')(args)
      break
  }
}
