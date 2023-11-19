import app from './config/app'
import env from './config/env'

app.listen(env.PORT, () => console.log(`server runnning at http://localhost:${env.PORT}`))
