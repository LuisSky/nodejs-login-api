import express from 'express'

import ExpressAdapter from '../../infra/adapters/express/express-adapter'

import { SignupRouterComposer, SigninRouterComposer } from '../composers'

const routes = express.Router()

routes.post('/auth/signup', ExpressAdapter.adapt(SignupRouterComposer.compose()))
routes.post('/auth/signin', ExpressAdapter.adapt(SigninRouterComposer.compose()))

export default routes
