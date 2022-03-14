const env = require('../src/config/env.js')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(routes)

app.listen(env.PORT, () => console.log(`server runnning at ${env.PORT}`))
