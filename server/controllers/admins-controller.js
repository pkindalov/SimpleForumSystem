const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  listAllCurrentAdmins: (req, res) => {
    User
                    .find({roles: 'Admin'})
                    .then(user => {
                      res.render('admins/list', {
                        user: user
                      })
                    })
  },

  addAdmin: (req, res) => {
    User
              .find({})
              .then(user => {
                res.render('admins/add', {
                  user: user
                })
              })
  },

  addAdminPost: (req, res) => {
    let reqBody = req.body
    let username = reqBody.username

    User
          .update({'username': username}, {$set: {'roles': 'Admin'} })
          .then(user => {
            res.redirect('/admins/list')
          })

    // User
    //           .find({ username: username }, function (err, user) {
    //             console.log(user)
    //             if (err) {
    //               console.log(err)
    //               return
    //             }

    //             user.roles = 'Admin'
    //             user.save()
    //           })
    //           .then(
    //             res.redirect('/admins/list')
    //           )
  }

}
