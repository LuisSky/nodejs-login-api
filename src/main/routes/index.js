const express = require('express')
const routes = express.Router()
const ExpressAdapter = require('../adapters/express-adapter')

// Routes
const SigninRouterCompose = require('../composers/signin-composer.js')
const SignupRouterComposer = require('../composers/signup-composer')

routes.post('/auth/signup', ExpressAdapter.adapt(SignupRouterComposer.compose()))
routes.post('/auth/signin', ExpressAdapter.adapt(SigninRouterCompose.compose()))

module.exports = routes
