const config = require('./config/server.js')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const routes = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(routes)


app.listen(config.PORT | 3000, () => console.log(`server runnning at ${config.PORT  | 3000}`))