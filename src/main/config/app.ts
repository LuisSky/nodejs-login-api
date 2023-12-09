import express from 'express'
const app = express()
import routes from '../../presentation/routes'

app.use(express.json())
app.use(routes)

export default app
