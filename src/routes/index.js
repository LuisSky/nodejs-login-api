const express = require('express')
const routes = express.Router()

// Routes
const SigninRouter = require('./signin.js')
const SignupRouter = require('./signup.js')


class ExpressAdapter {
  static adapt(route) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await route.route(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}


routes.post('/signup', ExpressAdapter.adapt(new SignupRouter()))
routes.post('/signin', ExpressAdapter.adapt(new SigninRouter()))


const UserRepository = require('../repository/user-repository.js')
routes.get('/users', (req, res) => {
  return res.status(200).json(new UserRepository().findAll())
})



module.exports = routes