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
                          answer: answer
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
  }

}
