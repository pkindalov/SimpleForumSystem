const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const User = mongoose.model('User')
const errorHandler = require('../utilities/error-handler')
const ObjectId = mongoose.Schema.Types.ObjectId

module.exports = {
  addTreadGet: (req, res) => {
    res.render('threads/add')
  },

  addTreadPost: (req, res) => {
    let threadReq = req.body

    // some validations here
    if (threadReq.title.length === 0) {
      res.locals.globalError = 'Title cannot be empty'
      res.render('threads/add')
      return
    }

    Thread
            .create({
              title: threadReq.title,
              description: threadReq.description,
              date: threadReq.date,
              author: req.user._id

            })
            .then(thread => {
              res.redirect('/threads/all')
            })
            .catch(err => {
              let message = errorHandler.handleMongooseError(err)
              res.locals.globalError = message
              res.render('threads/add', threadReq)
            })
  },
  allThreads: (req, res) => {
    let allThreads = Thread.find({})

    allThreads
                    .then(thread => {
                      User
                          .find({})
                          .where({'author': ObjectId(thread.author)})
                          .then(user => {
                            // console.log(user.username)
                            res.render('threads/all', {
                              threads: thread,
                              user: user
                            })
                          })
                    })
  },

  getDetails: (req, res) => {
    let id = req.params.id

    Thread
            .findById(id)
            .populate('answers')
            .then(thread => {
              console.log(thread)
              res.render('threads/details', {
                thread: thread,
                answers: thread.answers
              })
            })
  }

}
