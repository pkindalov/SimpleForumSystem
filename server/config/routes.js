const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/threads/add', auth.isAuthenticated, controllers.threads.addTreadGet)
  app.post('/threads/add', auth.isAuthenticated, controllers.threads.addTreadPost)
  app.get('/threads/all', controllers.threads.allThreads)
  app.get('/answers/list', controllers.answers.listAnswersByLatestDate)
  app.get('/post/:id/:title', controllers.threads.getDetails)
  app.get('/post/edit/:id/:title', controllers.threads.editThreadGet)
  app.post('/post/edit/:id/:title', controllers.threads.editThreadPost)
  app.get('/post/delete/:id/:title', controllers.threads.deleteThread)
  app.get('/add/answer/:id', controllers.answers.addComment)
  app.post('/add/answer/:id', controllers.answers.postComment)
  app.get('/answer/edit/:id/:title', controllers.answers.editAnswerGet)
  app.post('/answer/edit/:id', controllers.answers.editAnswerPost)
  app.get('/answer/delete/:id', controllers.answers.deletePost)
  app.get('/users/profile/:username', auth.isAuthenticated, controllers.users.getUserProfil)
  app.get('/admins/list', auth.isInRole('Admin'), controllers.admins.listAllCurrentAdmins)
  app.get('/admins/add', auth.isInRole('Admin'), controllers.admins.addAdmin)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.admins.addAdminPost)
  app.get('/admins/remove', auth.isInRole('Admin'), controllers.admins.removeAdminGet)
  app.post('/admins/remove', auth.isInRole('Admin'), controllers.admins.removeAdminPost)
  app.get('/post/like/:id/:title', auth.isAuthenticated, controllers.threads.addLikes)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not found')
    res.end()
  })
}
