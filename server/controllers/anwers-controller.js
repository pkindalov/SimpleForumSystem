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
                          thread: id,
                          author: req.user._id,
                          authorName: req.user.firstName
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
                // console.log(thread)

                // let authorsNames = []
                // for (let i = 0; i < thread.length; i++) {
                //   authorsNames.push(thread[i].author.username)
                // }

                // console.log(authorsNames)
                // User
                //       .findById()
                // console.log(thread[0].author._id)
                // console.log(thread[0].author.username)
                res.render('answers/list', {
                  threads: thread
                  // authorsNames: authorsNames
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
  },

  editAnswerGet: (req, res) => {
    let answerId = req.params.id

    Answer
            .findById(answerId)
            .then(answer => {
              console.log(answer)
              res.render('answers/edit', {
                answer: answer,
                id: answerId
              })
            })
  },

  editAnswerPost: (req, res) => {
    let updateAnswer = req.body
    let answerId = req.params.id
    let userId = req.user.id

    Answer.findById(answerId, function (err, data) {
      if (err) {
        console.log(err)
        return
      }

      data.answer = updateAnswer.answer
      data.date = Date.now()
      data.author = userId
      data.save()
    })
    .then(
      res.redirect('/threads/all')
    )
  },

  deletePost: (req, res) => {
    let answerId = req.params.id

    Answer
                .findByIdAndRemove(answerId)
                .then(answer => {
                  res.redirect('/threads/all')
                })
  }

}
