const express = require('express')
const routes = express.Router()

// Routes
const auth = require('../routes/auth.js')

routes.post('/signup', auth.signup)
routes.post('/signin', auth.signin)



module.exports = routes