const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  const cmd = args._[0]

  switch (cmd) {
    // add additional commands here..
    // case 'asdf':
    //   require('./cmds/asdf')(args)
    //   break
    default:
      require('./cmds/default')(args)
      break
  }
}