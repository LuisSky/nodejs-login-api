const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const routes = require('./routes')

const PORT = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(routes)


app.listen(PORT | 3000, () => console.log(`server runnning at ${PORT  | 3000}`))