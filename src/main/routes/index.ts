import express from 'express'
const routes = express.Router()
import ExpressAdapter from '../adapters/express-adapter'

// Routes
import SigninRouterCompose from '../composers/signin-composer'
import SignupRouterComposer from '../composers/signup-composer'

routes.post('/auth/signup', ExpressAdapter.adapt(SignupRouterComposer.compose()))
routes.post('/auth/signin', ExpressAdapter.adapt(SigninRouterCompose.compose()))

export default routes
