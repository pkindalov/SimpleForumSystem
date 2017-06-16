const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')
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
              author: req.user._id,
              views: 0

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
    let pageSizes = 2
    let page = parseInt(req.query.page) || 1

    let allThreads = Thread.find({})
    allThreads
                    .sort({'date': -1})
                    .skip((page - 1) * pageSizes)
                    .limit(pageSizes)
                    .then(thread => {
                      User
                          .find({})
                          // .where({'author': ObjectId(thread.author)})
                          .then(user => {
                            // console.log(user.username)
                            res.render('threads/all', {
                              threads: thread,
                              user: user,
                              hasPrevPage: page > 1,
                              hasNextPage: thread.length > 0,
                              nextPage: page + 1,
                              prevPage: page - 1
                            })
                          })
                    })
  },

  getDetails: (req, res) => {
    let id = req.params.id

    Thread
           .findByIdAndUpdate(id, {$inc: {views: 1}}, function (err, data) {
             if (err) {
               console.log(err)
             }

             Thread
            .findById(id)
            .populate('answers')
            .then(thread => {
              res.render('threads/details', {
                thread: thread,
                answers: thread.answers
              })
            })
           })
  },

  editThreadGet: (req, res) => {
    let ThreadId = req.params.id
    let ThreadTitle = req.params.title

    Thread
             .findById(ThreadId)
             .then(thread => {
               res.render('threads/edit', {
                 thread: thread,
                 title: ThreadTitle,
                 id: ThreadId
               })
             })
  },

  editThreadPost: (req, res) => {
    let updateReq = req.body
    let adminIp = req.user.id
    let threadId = req.params.id

    Thread.findById(threadId, function (err, data) {
      if (err) {
        console.log(err)
        return
      }

      data.title = updateReq.title
      data.description = updateReq.description
      data.date = Date.now()
      data.author = adminIp
      data.save()
    })
    .then(
      res.redirect('/threads/all')
    )

    // Thread
    //         .findById(threadId)
    //         .then(thread => {
    //           thread.title = updateReq.title
    //           thread.description = updateReq.description
    //           thread.date = Date.now()
    //           thread.author = adminIp
    //           thread.save()

    //           res.redirect('threads/all')
    //         })

    // let query = {id: threadId}
    // let update = {
    //   title: updateReq.title,
    //   description: updateReq.description,
    //   date: Date.now(),
    //   author: adminIp
    // }

    // Thread
    //         .findOneAndUpdate(query, update)
    //         .then(thread => {
    //           res.redirect('threads/all')
    //         })

    // Thread
    //           .update({_id: threadId}, {$set: {
    //             title: updateReq.title,
    //             description: updateReq.description,
    //             date: Date.now(),
    //             author: adminIp
    //           }})
    //           .then(
    //              res.redirect('threads/all')
    //           )

    // Thread
    //            .findById(threadId)
    //            .update({
    //              title: updateReq.title,
    //              description: updateReq.description,
    //              date: Date.now(),
    //              author: 'Edited by Admin'
    //            })
    //            .then(thread => {
    //              thread.save()
    //              res.redirect('threads/all')
    //            })
  },

  deleteThread: (req, res) => {
    // let updateReq = req.body
    let threadId = req.params.id

    Thread
            .findByIdAndRemove(threadId)
            .then(thread => {

            })

    Answer
                            .find({thread: threadId})
                            .remove()
                            .then(
                                 res.redirect('/threads/all')
                            )
  }

}
