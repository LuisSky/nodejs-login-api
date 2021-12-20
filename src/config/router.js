const express = require('express')
const routes = express.Router()

// Routes
const signup = require('../routes/auth-signup.js')

routes.post('/signup', signup.signup)



module.exports = routes