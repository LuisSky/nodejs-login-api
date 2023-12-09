import express from 'express'
const routes = express.Router()
import ExpressAdapter from '../../main/adapters/express-adapter'

// Routes
import SignupRouterComposer from '../../main/composers/signup-composer'
import SigninRouterCompose from '../../main/composers/signin-composer'

routes.post('/auth/signup', ExpressAdapter.adapt(SignupRouterComposer.compose()))
routes.post('/auth/signin', ExpressAdapter.adapt(SigninRouterCompose.compose()))

export default routes
