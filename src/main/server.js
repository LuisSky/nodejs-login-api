const app = require('./config/app')
const env = require('./config/env')

app.listen(env.PORT, () => console.log(`server runnning at http://localhost:${env.PORT}`))
