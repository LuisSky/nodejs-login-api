const express = require('express')
const routes = express.Router()
const ExpressAdapter = require('./adapters/express-adapter')

// Routes
const SigninRouterCompose = require('./composers/signin-composer.js')

routes.post('/signin', ExpressAdapter.adapt(SigninRouterCompose.compose()))

module.exports = routes
