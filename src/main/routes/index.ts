import express from 'express'
const routes = express.Router()
import ExpressAdapter from '../adapters/express-adapter'

// Routes
import SignupRouterComposer from '../composers/signup-composer'
import SigninRouterCompose from '../composers/signin-composer'

routes.post('/auth/signup', ExpressAdapter.adapt(SignupRouterComposer.compose()))
routes.post('/auth/signin', ExpressAdapter.adapt(SigninRouterCompose.compose()))

export default routes
