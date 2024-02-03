import { IHttpServer } from '../../../utils/protocols/http-server'
import routes from '../../../main/routes'
import express from 'express'

export class ExpressHttpServerAdapter implements IHttpServer {
  static server = express()

  listen (port: number): void {
    this.applyMidlewaresAndRoutes()
    ExpressHttpServerAdapter.server.listen(port, () => {
      console.log(`server runnning at http://localhost:${port}`)
    })
  }

  applyMidlewaresAndRoutes (): void {
    ExpressHttpServerAdapter.server.use(express.json())
    ExpressHttpServerAdapter.server.use(routes)
  }
}
