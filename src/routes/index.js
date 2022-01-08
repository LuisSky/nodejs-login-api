const express = require('express')
const routes = express.Router()

// Routes
const SigninRouter = require('./signin.js')
const SignupRouter = require('./signup.js')
const { UserRouteGet, UserRoutePost }  = require('./users.js')

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
routes.get('/users', ExpressAdapter.adapt(new UserRouteGet()))
routes.post('/users', ExpressAdapter.adapt(new UserRoutePost()))


module.exports = routes