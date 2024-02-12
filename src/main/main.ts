import Server from './config/server'
import { env } from './config/env'
import { ExpressAdapter } from '../infra/adapters/express/express-adapter'
import { SigninRouterComposer, SignupRouterComposer } from './composers'
import { PrismaAdapter } from '../infra/adapters/db/prisma-adapter'

void (async () => {
  const appExpress = new ExpressAdapter()
  appExpress.addRoute('post', '/auth/signup', SignupRouterComposer.compose())
  appExpress.addRoute('post', '/auth/signin', SigninRouterComposer.compose())

  const server = new Server(PrismaAdapter, appExpress)

  server.start(env.PORT)
})()
