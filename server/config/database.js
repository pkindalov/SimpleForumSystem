const mongoose = require('mongoose')
const User = require('../data/User')

mongoose.Promise = global.Promise

require('../data/Threads')
require('../data/Answers')

module.exports = (settings) => {
  mongoose.connect(settings.db)

  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log('MongoDB Ready')

    User.seedAdminUser()
  })

  db.on('error', err => console.log(`Database error ${err}`))
}
