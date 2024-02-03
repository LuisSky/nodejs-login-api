import express from 'express'

import ExpressAdapter from '../../infra/adapters/express/express-adapter'

import { SignupRouterComposer, SigninRouterCompose } from '../composers'

const routes = express.Router()

routes.post('/auth/signup', ExpressAdapter.adapt(SignupRouterComposer.compose()))
routes.post('/auth/signin', ExpressAdapter.adapt(SigninRouterCompose.compose()))

export default routes
