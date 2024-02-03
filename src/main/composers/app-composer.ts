import { PrismaAdapter } from '../../infra/adapters/db/prisma-adapter'
import { ExpressHttpServerAdapter } from '../../infra/adapters/express/express-http-server-adapter'
import App from '../config/app'

const expressHttpServerAdapter = new ExpressHttpServerAdapter()
export const app = new App(PrismaAdapter, expressHttpServerAdapter)
