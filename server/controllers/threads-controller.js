const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
// const Answers = require('../data/Answers')
// const errorHandler = require('../utilities/error-handler')
const errorHandler = require('../utilities/error-handler')

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
              date: threadReq.date
            })
            .then(thread => {
              res.redirect('threads/all')
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
                    .sort('-date')
                    .then(threads => {
                      res.render('threads/all', {
                        threads: threads
                      })
                    })
  }

}
