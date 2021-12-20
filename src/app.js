const express = require('express')
const app = express()

const routes = require('./config/router.js')

const PORT = 3000


app.use(routes)

app.listen(PORT | 3000, () => console.log(`server runnning at ${PORT  | 3000}`))