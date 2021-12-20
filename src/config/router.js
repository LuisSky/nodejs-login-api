const express = require('express')
const routes = express.Router()

// Routes
const signup = require('../routes/signup.js')

routes.get('/', signup)



module.exports = routes