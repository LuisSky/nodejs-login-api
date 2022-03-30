const express = require('express')
const routes = express.Router()
const ExpressAdapter = require('./adapters/express-adapter')

// Routes
const SigninRouter = require('./signin-router.js')
const SignupRouter = require('./signup-router.js')

routes.post('/signup', ExpressAdapter.adapt(new SignupRouter()))
routes.post('/signin', ExpressAdapter.adapt(new SigninRouter()))

module.exports = routes
