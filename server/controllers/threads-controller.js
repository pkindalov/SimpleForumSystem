const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')
const User = mongoose.model('User')
const errorHandler = require('../utilities/error-handler')
// const ObjectId = mongoose.Schema.Types.ObjectId

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
              views: 0,
              likesCount: 0,
              likers: [],
              rightToVoteUp: true
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
    // let rightToVoteUp = true

    let rightToVoteUp = true
    let allThreads = Thread.find({})
    allThreads
                    .sort({'date': -1})
                    .skip((page - 1) * pageSizes)
                    .limit(pageSizes)
                    .then(thread => {
                      // console.log(thread[0].likers)
                      try {
                        let userId = req.user.id
                        if (userId) {
                          // console.log(req.user.id)
                          for (let t of thread) {
                            // console.log(t)
                          // console.log(t.likers)
                            for (let l of t.likers) {
                              // console.log(t.likers)
                              // console.log(l === userId)
                              // console.log('l is: ' + l)
                              // console.log('userId is: ' + userId)
                              if (l === userId) {
                                rightToVoteUp = false
                                thread.rightToVoteUp = rightToVoteUp
                                thread.save()
                                break
                              }
                            }
                          }
                        }
                      } catch (ex) {

                      }

                      User
                          .find({})
                          // .where({'author': ObjectId(thread.author)})
                          .then(user => {
                           // here to check if user haveRightToVote
                            res.render('threads/all', {
                              threads: thread,
                              user: user,
                              hasPrevPage: page > 1,
                              hasNextPage: thread.length > 0,
                              nextPage: page + 1,
                              prevPage: page - 1,
                              rightToVoteUp: rightToVoteUp
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
  },

  addLikes: (req, res) => {
    let userID = req.user.id
    let threadId = req.params.id

    Thread
           .findByIdAndUpdate(threadId, {$inc: {likesCount: 1}, $push: {likers: userID}}, function (err, data) {
             if (err) {
               console.log(err)
             }

             Thread
            .findById(threadId)
            .populate('answers')
            .then(thread => {
              res.redirect('/threads/all')
              // res.render('threads/likes', {
              //   thread: thread,
              //   answers: thread.answers
              // })
            })
           })

    // res.render('threads/likes')
  }

}
