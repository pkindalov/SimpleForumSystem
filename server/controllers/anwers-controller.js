const mongoose = require('mongoose')
const Answer = mongoose.model('Answer')
const Thread = mongoose.model('Thread')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addComment: (req, res) => {
    let id = req.params.id

    Thread
            .findById(id)
            .then(thread => {
              res.render('answers/answers', {
                thread: thread
              })
            })
  },

  postComment: (req, res) => {
    let body = req.body
    let id = req.params.id

    Thread
            .findById(id)
            .then(thread => {
              let answer = body.answer

              Answer
                        .create({
                          answer: answer,
                          author: req.user._id
                        })
                        .then(answer => {
                          thread.answers.push(answer)
                          thread.save()
                          res.redirect('/')
                        })
                        .catch(err => {
                          let message = errorHandler.handleMongooseError(err)
                          console.log(message)
                        })
            })
  },

  listAnswersByLatestDate: (req, res) => {
    Thread
              .find({})
              .populate('answers')
              .populate('author')
              .sort('-date')
              .then(thread => {
                // console.log(thread.author)
                res.render('answers/list', {
                  threads: thread
                })
              })
    // Thread
    //               .find({})
    //               .then(thread => {
    //                 console.log(thread)
    //                 Answer
    //                           .find({})
    //                           .sort('-date')
    //                           .then(answer => {
    //                             res.render('answers/list', {
    //                               threads: thread,
    //                               answers: answer
    //                             })
    //                           })
    //               })
  }

}
