const home = require('./home-controller')
const users = require('./users-controller')
const threads = require('./threads-controller')
const answers = require('./anwers-controller')

module.exports = {
  home: home,
  users: users,
  threads: threads,
  answers: answers
}
